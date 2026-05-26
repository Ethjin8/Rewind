// Function we call that deals with protected endpoints

export async function authFetch(url, options = {}) {
  let token = localStorage.getItem('accessToken');

  // Populate our HTML request with everything in the "options" parameter passed in (JS object)
  // Then, we add an additional entry: Authorization, which contains our access token
  options.headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`
  };

  let response = await fetch(url, options);

  // If we are forbidden from seeing this page
  if (response.status === 403) {
    const refreshToken = localStorage.getItem('refreshToken');

    // Try getting a refresh token
    const refreshResponse = await fetch(`/api/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: refreshToken })
    });

    // If we got a refresh token, then try getting another access token. Otherwise, the session is truly dead
    if (refreshResponse.ok) {
      const data = await refreshResponse.json();
      localStorage.setItem('accessToken', data.accessToken);

      options.headers['Authorization'] = `Bearer ${data.accessToken}`;
      response = await fetch(url, options);
    } else {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/';
    }
  }

  return response; 
}
