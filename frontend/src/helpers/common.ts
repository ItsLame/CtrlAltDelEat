// const previewImage = (file: File | null) => {
//   const reader = new FileReader();
//   reader.addEventListener("loadend", () => {
//     setItemImage(reader.result?.toString());
//   });
//   file && reader.readAsDataURL(file);
// };

export const _displayImage = (file: File | null) => {
  const reader = new FileReader();
  reader.addEventListener("loadend", () => {
    return reader.result?.toString();
  });
  file && reader.readAsDataURL(file);
};

export function displayImage (file: File | null) {
  const validFileTypes = [ "image/jpeg", "image/png", "image/jpg" ];
  const valid = validFileTypes.find(type => type === file?.type);
  if (!valid) {
    throw Error("provided file is not a png, jpg or jpeg image.");
  }

  const reader = new FileReader();
  const dataUrlPromise = new Promise((resolve, reject) => {
    reader.onerror = reject;
    reader.onload = () => resolve(reader.result?.toString());
  });
  file && reader.readAsDataURL(file);
  return dataUrlPromise as Promise<string>;
}
