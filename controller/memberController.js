const { cloudinary } = require("../config/cloudinaryConfig");
const Members = require("../modal/memberModel");
const CustomError = require("../utils/customError");
const asyncErrorHandler = require("./../utils/asyncErrorHandler");

exports.getUsers = asyncErrorHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 6;

  const members = await Members.find(
    {},
    "firstName lastName email phone profilePic"
  )
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await Members.countDocuments();
  res.status(200).json({
    status: "success",
    count: members.length,

    data: {
      members,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    },
  });
});

exports.createUser = asyncErrorHandler(async (req, res, next) => {
  let profilePicUrl = null;

  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "profilePics",
    });

    profilePicUrl = {
      url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
    };
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
});

exports.updateUser = asyncErrorHandler(async (req, res, next) => {
  let updatedData = { ...req.body };
  console.log(updatedData);

  const getMember = await Members.findById(req.params.id);

  if (!getMember) {
    return next(
      new CustomError("Member not found. Please provide a valid ID", 404)
    );
  }

  if (req.file) {
    if (getMember.profilePic && getMember.profilePic.public_id) {
      await cloudinary.uploader.destroy(getMember.profilePic.public_id);
    }

    const uploadResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "profile_pics",
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

  res.status(201).json({
    status: "success",
    data: {
      updatedMember,
    },
  });
});

exports.deleteUser = asyncErrorHandler(async (req, res, next) => {
  const deleteMember = await Members.findById(req.params.id);
  if (!deleteMember) {
    return next(
      new CustomError("Member not found. Please provide a valid ID", 400)
    );
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
});

exports.getSearchedUsers = asyncErrorHandler(async (req, res, next) => {
  const { lastName } = req.query;
  console.log(lastName);

  const searchedMembers = await Members.find(
    { lastName: { $regex: `^${lastName}` } },
    "firstName lastName email phone profilePic"
  );
  if (searchedMembers.length === 0) {
    return next(
      new CustomError(
        "No member with the given surname was found. Please provide the correct surname",
        400
      )
    );
  }

  res.status(200).json({
    status: "Success",
    total: searchedMembers.length,
    data: {
      searchedMembers,
    },
  });
});

exports.getUser = asyncErrorHandler(async (req, res, next) => {
  const member = await Members.findById(req.params.id);
  if (!member) {
    return next(
      new CustomError("Member not found. Please provide a valid ID", 404)
    );
  }
  res.status(200).json({
    status: "Success",
    data: {
      member,
    },
  });
});
