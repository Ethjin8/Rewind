  // Returns a bool indicating whether the given movie has a streaming provider that
  //  matches the user's selected streaming services.
function normalizeProviderName(name) {
    if (name.includes('Max')) return 'HBO Max';
    if (name.includes('Prime Video')) return 'Prime Video';
    if (name.includes('Crunchyroll')) return 'Crunchyroll';
    if (name.includes('Peacock')) return 'Peacock';
    if (name.includes('Paramount')) return 'Paramount+';
    if (name.includes('Disney')) return 'Disney+';
    if (name.includes('Netflix')) return 'Netflix';
    if (name.includes('Apple')) return 'Apple TV';
    return name;
    }

    function getSelectedServices() {
      return JSON.parse(localStorage.getItem("selectedServices")) || [];
    }

  // Returns a bool indicating whether the given movie has a streaming provider that
  //  matches the user's selected streaming services.
export function hasSelectedStreamingService(movie) {
    const providers =
      movie["watch/providers"]?.results?.US?.flatrate ?? [];
  // .some iterates through the providers and returns true if 
  // *any provider's name is included in the user's selected services.
    return providers.some((provider) =>
      getSelectedServices().includes( normalizeProviderName(provider.provider_name) )
    )
  }