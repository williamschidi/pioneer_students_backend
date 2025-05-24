const { cloudinary } = require("../config/cloudinaryConfig");
const Members = require("../modal/memberModel");

exports.getUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 2;

  try {
    const members = await Members.find(
      {},
      "firstName lastName email phone profilePic"
    )
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Members.countDocuments();
    res.status(200).json({
      status: "success",
      data: {
        members,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    err.status(500).json({
      error: err.message,
    });
  }
};

exports.createUser = async (req, res) => {
  try {
    let profilePicUrl = null;

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "profilePics",
      });

      profilePicUrl = { url: result.secure_url, public_id: result.public_id };
    }
    const memberData = { ...req.body, profilePic: profilePicUrl };

    const newMember = await Members.create(memberData);
    res.status(201).json({
      status: "success",
      message: "Member successfully created",
      data: {
        newMember,
      },
    });
  } catch (err) {
    res.status(400).json({
      error: err.stack,
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    let updatedData = { ...req.body };

    const updateMember = await Members.findById(req.params.id);

    if (!updateMember) {
      return res.status(404).json({
        message: "Member not found. Please provide a valid ID",
      });
    }

    if (req.file) {
      if (updateMember.profilePic && updateMember.profilePic.public_id) {
        await cloudinary.uploader.destroy(updateMember.profilePic.public_id);
      }

      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "profile_pics",
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          )
          .end(req.file.buffer);
      });
      updatedData.profilePic = {
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
      };
    }

    const updatedMember = await Members.findByIdAndUpdate(
      req.params.id,
      updatedData,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: "success",
      data: {
        updatedMember,
      },
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const deleteMember = await Members.findById(req.params.id);
    if (!deleteMember) {
      return res.status(400).json({
        message: "Member not found. Please provide a valid ID",
      });
    }
    if (deleteMember.profilePic) {
      const parts = deleteMember.profilePic.split("/");
      const fileName = parts[parts.length - 1];
      const publicId = fileName.split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    }
    await Members.findByIdAndDelete(req.params.id);
    res.status(201).json({
      message: "Member deleted successfully",
    });
  } catch (err) {
    err.status(500).json({
      error: err.message,
    });
  }
};

exports.getUser = async (req, res) => {
  try {
    const member = await Members.findById(req.params.id);
    if (!member) {
      return res.status(404).json({
        status: "Failed",
        message: "User not found. Please provide a valid ID",
      });
    }
    res.status(200).json({
      status: " success",
      data: {
        member,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
