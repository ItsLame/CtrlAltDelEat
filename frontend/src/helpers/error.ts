export function failedGetError () {
  throw new Error("Failed to fetch data");
}

export function failedPostError () {
  throw new Error("Failed to post data");
}

export function failedPutError () {
  throw new Error("Failed to update data");
}

export function failedDeleteError () {
  throw new Error("Failed to delete data");
}
