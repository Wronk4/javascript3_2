document.addEventListener('DOMContentLoaded', () => {

    const fetchButton = document.getElementById('fetchButton');
    const resultsBody = document.getElementById('resultsBody');
    const errorContainer = document.getElementById('errorContainer');

    const apiToken = '';

    fetchButton.addEventListener('click', fetchLocationData);

    async function fetchLocationData() {
        resultsBody.innerHTML = '';
        errorContainer.textContent = '';

        if (apiToken === 'TWOJ_TOKEN_API_TUTAJ' || !apiToken) {
            errorContainer.textContent = 'Proszę wpisać swój token API w pliku app.js w zmiennej apiToken.';
            return;
        }

        const targetUrl = 'https://www.ncei.noaa.gov/cdo-web/api/v2/locations?limit=50';
        const proxyUrl = `https://corsproxy.io/?${targetUrl}`;

        try {
            const response = await fetch(proxyUrl, {
                headers: {
                    'token': apiToken
                }
            });

            if (!response.ok) {
                let errorMsg = `Błąd pobierania danych (Status: ${response.status})`;
                if (response.status === 401 || response.status === 403) {
                    errorMsg += ' - Sprawdź, czy token API jest poprawny.';
                }
                throw new Error(errorMsg);
            }

            const data = await response.json();

            if (!data.results || data.results.length === 0) {
                 errorContainer.textContent = 'Nie znaleziono żadnych lokalizacji.';
                 return;
            }

            data.results.forEach(location => {
                const row = document.createElement('tr');

                const id = location.id || 'Brak danych';
                const name = location.name || 'Brak danych';
                const minDate = location.mindate || 'Brak danych';
                const maxDate = location.maxdate || 'Brak danych';

                row.innerHTML = `
                    <td>${id}</td>
                    <td>${name}</td>
                    <td>${minDate}</td>
                    <td>${maxDate}</td>
                `;

                resultsBody.appendChild(row);
            });

        } catch (error) {
            errorContainer.textContent = error.message;
            console.error('Wystąpił błąd:', error);
        }
    }
});