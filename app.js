document.addEventListener('DOMContentLoaded', () => {

    const fetchButton = document.getElementById('fetchButton');
    const resultsBody = document.getElementById('resultsBody');
    const errorContainer = document.getElementById('errorContainer');
    
    const datasetInput = document.getElementById('datasetInput');
    const locationInput = document.getElementById('locationInput');
    const startDateInput = document.getElementById('startDateInput');
    const endDateInput = document.getElementById('endDateInput');

    const apiToken = '';

    fetchButton.addEventListener('click', fetchData);

    async function fetchData() {
        resultsBody.innerHTML = '';
        errorContainer.textContent = '';

        const datasetid = datasetInput.value.trim();
        const locationid = locationInput.value.trim();
        const startdate = startDateInput.value;
        const enddate = endDateInput.value;

        if (!datasetid || !locationid || !startdate || !enddate) {
            errorContainer.textContent = 'Wszystkie pola parametrów są wymagane.';
            return;
        }

        const baseUrl = 'https://www.ncei.noaa.gov/cdo-web/api/v2/data';
        
        const params = new URLSearchParams({
            datasetid: datasetid,
            locationid: locationid,
            startdate: startdate,
            enddate: enddate,
            limit: 100 
        });

        const targetUrl = `${baseUrl}?${params.toString()}`;
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
                 errorContainer.textContent = 'Nie znaleziono danych dla podanych kryteriów.';
                 return;
            }

            data.results.forEach(record => {
                const row = document.createElement('tr');

                const date = record.date ? record.date.split('T')[0] : 'Brak';
                const type = record.datatype || 'Brak';
                const value = record.value !== undefined ? record.value : 'Brak';
                const station = record.station || 'Brak';

                row.innerHTML = `
                    <td>${date}</td>
                    <td>${type}</td>
                    <td>${value}</td>
                    <td>${station}</td>
                `;

                resultsBody.appendChild(row);
            });

        } catch (error) {
            errorContainer.textContent = error.message;
            console.error('Wystąpił błąd:', error);
        }
    }
});