export function getLoggedInUser() {
  const token = localStorage.getItem('accessToken');

  if (!token) return null;

  try {
    const payload = token.split('.')[1];

    const decodedPayload = JSON.parse(
      atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    );

    return decodedPayload;
  } catch (error) {
    console.error('Could not decode token:', error);
    return null;
  }
}