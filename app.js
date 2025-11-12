document.addEventListener('DOMContentLoaded', () => {

    const fetchButton = document.getElementById('fetchButton');
    const resultsBody = document.getElementById('resultsBody');
    const errorContainer = document.getElementById('errorContainer');

    fetchButton.addEventListener('click', fetchStationData);


    async function fetchStationData() {

        resultsBody.innerHTML = '';
        errorContainer.textContent = '';

        //corsproxy bo nie zadziala lokalnie
        const apiUrl = 'https://corsproxy.io/?https://www.ncei.noaa.gov/cdo-web/api/v2/stations?limit=50';

        try {
            const response = await fetch(apiUrl, {
                headers: {
                    'token': ''
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
                 errorContainer.textContent = 'Nie znaleziono żadnych stacji dla tego zapytania.';
                 return;
            }

            data.results.forEach(station => {
                const row = document.createElement('tr');

                const id = station.id || 'Brak danych';
                const name = station.name || 'Brak danych';
                const latitude = station.latitude || 'Brak danych';
                const longitude = station.longitude || 'Brak danych';

                row.innerHTML = `
                    <td>${id}</td>
                    <td>${name}</td>
                    <td>${latitude}</td>
                    <td>${longitude}</td>
                `;

                resultsBody.appendChild(row);
            });

        } catch (error) {
            errorContainer.textContent = error.message;
            console.error('Wystąpił błąd:', error);
        }
    }
});