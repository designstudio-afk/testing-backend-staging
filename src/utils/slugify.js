export const generateSlug = (title, locationDate) => {
  const titleSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

  const dateSlug = locationDate
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

  return `${titleSlug}-${dateSlug}`
}
