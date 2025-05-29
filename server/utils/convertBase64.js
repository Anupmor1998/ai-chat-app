const convertToBase64 = (file) => {
  const mimeType = file?.mimetype; // e.g., 'image/png'
  return `data:${mimeType};base64,${file?.buffer.toString("base64")}`;
};

module.exports = convertToBase64;
