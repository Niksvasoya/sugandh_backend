const { Storage } = require("@google-cloud/storage");
const { format } = require("util");

const storage = new Storage({
  projectId: "sugandh-ea169",
  credentials: require("../../sugandh-ea169-firebase-adminsdk-i1hez-93869e08db.json"),
  predefinedAcl: "publicRead",
  cacheControl: "public, max-age=31536000",
});

const bucket = storage.bucket("gs://sugandh-ea169.appspot.com");

var uploadImageToStorage = async (file) => {
  console.log(file);
  if (!file) {
    return null;
  }
  console.log("blobStream " + file.name);
  var file_name = file.name.replace(/\s/g, "").trim();
  let newFileName = `${Date.now()}_${file_name}`;
  console.log("blobStream " + newFileName.replace(/\s/g, ""));
  let fileUpload = bucket.file(newFileName);

  const blobStream = await fileUpload.createWriteStream({
    metadata: {
      contentType: file.mimetype,
    },
  });

  const url = format(
    `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`
  );
  console.log("blobStream " + url);

  /* await   blobStream.on('error', (error) => {
    return 'FAIL';
   });

 await  blobStream.on('finish', () => {
     // The public URL can be used to directly access the file via HTTP.
     
   });*/

  blobStream.end(file.data);

  return url;
};

var uploadFileToStorage = async (file) => {
  console.log(file);
  if (!file) {
    return null;
  }
  console.log("blobStream " + file.name);
  var file_name = file.name.replace(/\s/g, "").trim();
  let newFileName = `${Date.now()}_${file_name}`;
  console.log("blobStream " + newFileName.replace(/\s/g, ""));
  let fileUpload = bucket.file(newFileName);

  const blobStream = await fileUpload.createWriteStream({
    metadata: {
      contentType: file.mimetype,
    },
  });

  const url = format(
    `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`
  );
  console.log("blobStream " + url);

  /* await   blobStream.on('error', (error) => {
    return 'FAIL';
   });

 await  blobStream.on('finish', () => {
     // The public URL can be used to directly access the file via HTTP.
     
   });*/

  blobStream.end(file.data);

  return url;
};

var uploadBhaktiData = async (file, req) => {
  console.log(file);
  if (!file) {
    return null;
  }
  let file_name;
  if (req.god_name != undefined) {
    file_name = `${req.god_name}`;
  }
  if (req.bhakti_category_name != undefined) {
    file_name = `${file_name}_${req.bhakti_category_name}`;
  }
  console.log("blobStream " + file.name);
  let newFileName;
  if (file_name != undefined) {
    file_name = file_name.replace(/\s/g, "").trim();
    newFileName = `${file_name}_${Date.now()}`;
  } else {
    newFileName = `${Date.now()}`;
  }
  console.log("blobStream " + newFileName.replace(/\s/g, ""));
  let fileUpload = bucket.file(newFileName);

  const blobStream = await fileUpload.createWriteStream({
    metadata: {
      contentType: file.mimetype,
    },
  });

  const url = format(
    `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`
  );
  console.log("blobStream " + url);

  /* await   blobStream.on('error', (error) => {
    return 'FAIL';
   });

 await  blobStream.on('finish', () => {
     // The public URL can be used to directly access the file via HTTP.
     
   });*/

  blobStream.end(file.data);

  return url;
};
var uploadDarshanData = async (file, req) => {
  console.log(file);
  if (!file) {
    return null;
  }
  let file_name;
  if (req.god_name != undefined) {
    file_name = `${req.god_name}`;
  }

  console.log("blobStream " + file.name);
  let newFileName;
  if (file_name != undefined) {
    file_name = file_name.replace(/\s/g, "").trim();
    newFileName = `${file_name}_${Date.now()}`;
  } else {
    newFileName = `${Date.now()}`;
  }
  console.log("blobStream " + newFileName.replace(/\s/g, ""));
  let fileUpload = bucket.file(newFileName);

  const blobStream = await fileUpload.createWriteStream({
    metadata: {
      contentType: file.mimetype,
    },
  });

  const url = format(
    `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`
  );
  console.log("blobStream " + url);

  /* await   blobStream.on('error', (error) => {
    return 'FAIL';
   });

 await  blobStream.on('finish', () => {
     // The public URL can be used to directly access the file via HTTP.
     
   });*/

  blobStream.end(file.data);

  return url;
};
var DeleteImage = async (url) => {
  // Deletes the file from the bucket
  let image = url.replace(
    "https://storage.googleapis.com/livebhagwan-7dd31.appspot.com/",
    ""
  );
  console.log(image);
  try {
    await bucket.file(image).delete();
    console.log(`deleted.`);
    return true;
  } catch {
    return false;
  }
};
module.exports = {
  uploadImageToStorage,
  uploadFileToStorage,
  uploadBhaktiData,
  uploadDarshanData,
  DeleteImage,
};
