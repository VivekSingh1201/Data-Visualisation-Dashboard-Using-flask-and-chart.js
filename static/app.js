

document.addEventListener('DOMContentLoaded', () => {
    const yearFilter = document.getElementById('yearFilter');
    const ctx = document.getElementById('myChart').getContext('2d');
    let myChart;

    fetch('/data')
        .then(response => response.json())
        .then(data => {
            const dataFilter = data.filter(d => d.year && d.intensity && d.relevance && d.topics);
            
            const yearCounts = dataFilter.reduce((acc, d) => {
                acc[d.year] = (acc[d.year] || 0) + 1;
                return acc;
            }, {});
            
            const filteredData = dataFilter.filter(d => yearCounts[d.year] > 1);
            const years = [...new Set(filteredData.map(d => d.year))];
            
            years.forEach(year => {
                const option = document.createElement('option');
                option.value = year;
                option.textContent = year;
                yearFilter.appendChild(option);
            });
            
            renderChart(filteredData);
        })
        .catch(error => console.error('Error fetching data:', error));

    yearFilter.addEventListener('change', () => {
        fetch('/data')
            .then(response => response.json())
            .then(data => {
                const dataFilter = data.filter(d => d.year && d.intensity && d.relevance && d.topics);
                
                const yearCounts = dataFilter.reduce((acc, d) => {
                    acc[d.year] = (acc[d.year] || 0) + 1;
                    return acc;
                }, {});
                
                const filteredData = yearFilter.value 
                    ? dataFilter.filter(d => d.year == yearFilter.value && yearCounts[d.year] > 1) 
                    : dataFilter.filter(d => yearCounts[d.year] > 1);
                
                renderChart(filteredData);
            })
            .catch(error => console.error('Error fetching data:', error));
    });

    function aggregateDataByTopic(data) {
        const aggregatedData = data.reduce((acc, d) => {
            if (!acc[d.topics]) {
                acc[d.topics] = { intensity: 0, count: 0 };
            }
            acc[d.topics].intensity += d.intensity;
            acc[d.topics].count += 1;
            return acc;
        }, {});

        return Object.keys(aggregatedData).map(topic => ({
            topic,
            intensity: aggregatedData[topic].intensity / aggregatedData[topic].count
        }));
    }

    function renderChart(data) {
        if (myChart) {
            myChart.destroy();
        }

        const aggregatedData = aggregateDataByTopic(data);

        myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: aggregatedData.map(d => d.topic),
                datasets: [{
                    label: 'Intensity',
                    data: aggregatedData.map(d => d.intensity),
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                tension: 0.4,
                responsive: true,
                scales: {
                    x: {
                        grid: {
                            display: false,
                        },
                        title: {
                            display: true,
                            text: 'Topic'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            display: false,
                        },
                        title: {
                            display: true,
                            text: 'Intensity'
                        }
                    }
                }
            }
        });
    }
});


document.addEventListener('DOMContentLoaded', () => {
    const countrySelect = document.getElementById('countrySelect');
    const ctx = document.getElementById('myChart1').getContext('2d');
    let myChart;

    fetch('/data')
        .then(response => response.json())
        .then(data => {
            const filteredData = data.filter(d => d.country && d.sector);
            const countries = [...new Set(filteredData.map(d => d.country))];
            countries.forEach(country => {
                const option = document.createElement('option');
                option.value = country;
                option.textContent = country;
                countrySelect.appendChild(option);
            });
            renderChart(filteredData);
        })
        .catch(error => console.error('Error fetching data:', error));

    countrySelect.addEventListener('change', () => {
        fetch('/data')
            .then(response => response.json())
            .then(data => {
                const filteredData = data.filter(d => d.country && d.sector);
                const countryFilteredData = countrySelect.value ? filteredData.filter(d => d.country === countrySelect.value) : filteredData;
                renderChart(countryFilteredData);
            })
            .catch(error => console.error('Error fetching data:', error));
    });

    function aggregateDataBySector(data) {
        const aggregatedData = data.reduce((acc, d) => {
            if (!acc[d.sector]) {
                acc[d.sector] = { intensity: 0, count: 0 };
            }
            acc[d.sector].intensity += d.intensity;
            acc[d.sector].count += 1;
            return acc;
        }, {});

        return Object.keys(aggregatedData).map(sector => ({
            sector,
            intensity: aggregatedData[sector].intensity / aggregatedData[sector].count
        }));
    }

    function renderChart(data) {
        if (myChart) {
            myChart.destroy();
        }

        const aggregatedData = aggregateDataBySector(data);

        myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: aggregatedData.map(d => d.sector),
                datasets: [{
                    label: 'Intensity',
                    data: aggregatedData.map(d => d.intensity),
                    backgroundColor: 'rgba(79, 59, 169, 0.7)',
                    borderColor: 'rgba(79, 59, 169, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                // maintainAspectRatio: false,
                responsive: true,
                scales: {
                    x: {
                        title: {
                            text: 'Sector',
                            display: true,
                        },
                        stacked: true
                    },
                    y: {
                        title: {
                            text: 'Intensity',
                            display: true,
                        },
                        stacked: true,
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(200, 200, 200, 0.2)'
                        }
                    }
                }
            }
        });
    }
});


document.addEventListener('DOMContentLoaded', () => {
    const countrySelect = document.getElementById('countrySelect1');
    const ctx = document.getElementById('myPieChart').getContext('2d');
    let myPieChart;

    fetch('/data')
        .then(response => response.json())
        .then(data => {

            const filteredData = data.filter(d => d.country && d.sector);

            const countries = [...new Set(filteredData.map(d => d.country))];
            countries.forEach(country => {
                const option = document.createElement('option');
                option.value = country;
                option.textContent = country;
                countrySelect.appendChild(option);
            })

            if (countries.length > 0) {
                renderCountrySectors(countries[0]);
            }

            countrySelect.addEventListener('change', () => {
                renderCountrySectors(countrySelect.value);
            });

            function renderCountrySectors(country) {
                const countryData = filteredData.filter(d => d.country === country);
                console.log(countryData);

                const sectorCounts = {};
                countryData.forEach(d => {
                    if (d.sector) {
                        if (!sectorCounts[d.sector]) {
                            sectorCounts[d.sector] = 0;
                        }
                        sectorCounts[d.sector]++;
                    }
                });

                const labels = Object.keys(sectorCounts);
                const chartData = Object.values(sectorCounts);

                renderPieChart(labels, chartData);
            }

            function renderPieChart(labels, data) {
                if (myPieChart) {
                    myPieChart.destroy();
                }

        myPieChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        // display: false,
                        position: 'right',
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                return `${label}: ${value}`;
                            }
                        }
                    }
                }
            }
        });
    }
})
    .catch(error => console.error('Error fetching data:', error));
});

document.addEventListener('DOMContentLoaded', () => {
    const countrySelect = document.getElementById('countrySelect2');
    const regionSelect = document.getElementById('regionSelect');
    const ctx = document.getElementById('myPieChart2').getContext('2d');
    let myPieChart;

    fetch('/data')
        .then(response => response.json())
        .then(data => {
            console.log('Fetched data:', data);

            const filteredData = data.filter(d => d.country && d.region && d.topics);

            const countries = [...new Set(filteredData.map(d => d.country))];
            countries.forEach(country => {
                const option = document.createElement('option');
                option.value = country;
                option.textContent = country;
                countrySelect.appendChild(option);
            });

            countrySelect.addEventListener('change', () => {
                updateRegionSelect(countrySelect.value);
                renderPieChart(countrySelect.value, regionSelect.value);
            });

            regionSelect.addEventListener('change', () => {
                renderPieChart(countrySelect.value, regionSelect.value);
            });

            updateRegionSelect('all');
            renderPieChart('all', 'all');

            function updateRegionSelect(selectedCountry) {
                regionSelect.innerHTML = '<option value="all">All Regions</option>';

                const countryData = selectedCountry === 'all' ? filteredData : filteredData.filter(d => d.country === selectedCountry);

                const regions = [...new Set(countryData.map(d => d.region))];
                regions.forEach(region => {
                    const option = document.createElement('option');
                    option.value = region;
                    option.textContent = region;
                    regionSelect.appendChild(option);
                });
            }

            function renderPieChart(selectedCountry, selectedRegion) {
                let countryData = selectedCountry === 'all' ? filteredData : filteredData.filter(d => d.country === selectedCountry);
                let regionData = selectedRegion === 'all' ? countryData : countryData.filter(d => d.region === selectedRegion);

                const topicCounts = {};
                regionData.forEach(d => {
                    if (!topicCounts[d.topics]) {
                        topicCounts[d.topics] = 0;
                    }
                    topicCounts[d.topics]++;
                });

                const labels = [];
                const chartData = [];
                const othersThreshold = 7;
                let othersCount = 0;

                for (let topic in topicCounts) {
                    if(labels.length>17){
                        if (topicCounts[topic] >= othersThreshold) {
                            labels.push(topic);
                            chartData.push(topicCounts[topic]);
                        } else {
                            othersCount += topicCounts[topic];
                        }
                        
                    }
                    else{
                        labels.push(topic);
                        chartData.push(topicCounts[topic]);
                    }
                }

                if (othersCount > 0) {
                    labels.push("Others");
                    chartData.push(othersCount);
                }

                if (myPieChart) {
                    myPieChart.destroy();
                }

                myPieChart = new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: labels,
                        datasets: [{
                            data: chartData,
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.2)',
                                'rgba(54, 162, 235, 0.2)',
                                'rgba(255, 206, 86, 0.2)',
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(255, 159, 64, 0.2)'
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)'
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'right',
                            },
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        const label = context.label || '';
                                        const value = context.raw || 0;
                                        return `${label}: ${value}`;
                                    }
                                }
                            }
                        }
                    }
                });
            }
        })
        .catch(error => console.error('Error fetching data:', error));
});

document.addEventListener('DOMContentLoaded', () => {
    const ctx = document.getElementById('myBubbleChart').getContext('2d');
    let myBubbleChart;

    fetch('/data')
        .then(response => response.json())
        .then(data => {
            console.log('Fetched data:', data);

            const filteredData = data.filter(d => d.intensity && d.relevance && d.likelihood);

            const chartData = filteredData.map(d => ({
                x: d.intensity,
                y: d.relevance,
                r: d.likelihood
            }));

            if (myBubbleChart) {
                myBubbleChart.destroy();
            }

            myBubbleChart = new Chart(ctx, {
                type: 'bubble',
                data: {
                    datasets: [{
                        label: 'Bubble Chart',
                        data: chartData,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    maintainAspectRatio: false,
                    responsive: true,
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const label = `Intensity: ${context.raw.x}, Relevance: ${context.raw.y}, Likelihood: ${context.raw.r}`;
                                    return label;
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            stacked: true,
                            title: {
                                display: true,
                                text: 'Intensity'
                            },
                            beginAtZero: true
                        },
                        y: {
                            stacked: true,
                            title: {
                                display: true,
                                text: 'Relevance'
                            },
                            beginAtZero: true
                        }
                    }
                }
            });
        })
        .catch(error => console.error('Error fetching data:', error));
});


document.addEventListener('DOMContentLoaded', () => {
    const yearSelect = document.getElementById('yearSelect');
    const countrySelect = document.getElementById('countrySelect3');
    const ctx = document.getElementById('relevanceChart').getContext('2d');
    let relevanceChart;

    fetch('/data')
        .then(response => response.json())
        .then(data => {
            console.log('Fetched data:', data);

            const filteredData = data.filter(d => d.year && d.country && d.relevance && d.source);

            const years = [...new Set(filteredData.map(d => d.year))];
            const countries = [...new Set(filteredData.map(d => d.country))];

            years.forEach(year => {
                const option = document.createElement('option');
                option.value = year;
                option.textContent = year;
                yearSelect.appendChild(option);
            });

            countries.forEach(country => {
                const option = document.createElement('option');
                option.value = country;
                option.textContent = country;
                countrySelect.appendChild(option);
            });

            renderChart('all', 'all');

            yearSelect.addEventListener('change', () => {
                renderChart(yearSelect.value, countrySelect.value);
            });

            countrySelect.addEventListener('change', () => {
                renderChart(yearSelect.value, countrySelect.value);
            });

            function renderChart(selectedYear, selectedCountry) {
                let dataForChart = filteredData;
                if (selectedYear !== 'all') {
                    dataForChart = dataForChart.filter(d => d.year === parseInt(selectedYear));
                }
                if (selectedCountry !== 'all') {
                    dataForChart = dataForChart.filter(d => d.country === selectedCountry);
                }

                const sourceCounts = {};
                dataForChart.forEach(d => {
                    if (!sourceCounts[d.source]) {
                        sourceCounts[d.source] = 0;
                    }
                    sourceCounts[d.source] += d.relevance;
                });

                const labels = Object.keys(sourceCounts);
                const chartData = Object.values(sourceCounts);

                if (relevanceChart) {
                    relevanceChart.destroy();
                }

                relevanceChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Relevance',
                            data: chartData,
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        return `Source: ${context.label}, Relevance: ${context.raw}`;
                                    }
                                }
                            }
                        },
                        scales: {
                            x: {
                                title: {
                                    display: true,
                                    text: 'Source'
                                }
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: 'Relevance'
                                },
                                beginAtZero: true
                            }
                        }
                    }
                });
            }
        })
        .catch(error => console.error('Error fetching data:', error));
});

