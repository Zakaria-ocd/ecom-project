export function getUserImageUrl(user) {
  if (!user?.id || !user?.image) return null;

  const apiUrl = (
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
  ).replace(/\/$/, "");

  return `${apiUrl}/api/users/imageById/${user.id}`;
}
