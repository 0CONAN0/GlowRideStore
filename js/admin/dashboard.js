// js/admin/dashboard.js

import { API_BASE_URL } from './config.js';

/**
 * Retrieves a specific cookie value by name.
 * @param {string} name - The name of the cookie to retrieve.
 * @returns {string|null} - The cookie value or null if not found.
 */
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

document.addEventListener('DOMContentLoaded', async () => {
    const token = getCookie('token') || localStorage.getItem('token');

    if (!token) {
        alert('Unauthorized access. Please log in.');
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/admin/dashboard-metrics`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to load dashboard metrics.');
        }

        const data = await response.json();

        // Update UI elements with fetched data
        const totalSalesElement = document.getElementById('total-sales');
        const totalOrdersElement = document.getElementById('total-orders');
        const totalUsersElement = document.getElementById('total-users');

        if (totalSalesElement) {
            totalSalesElement.textContent = `EGP ${parseFloat(data.totalSales).toFixed(2)}`;
        }

        if (totalOrdersElement) {
            totalOrdersElement.textContent = data.totalOrders;
        }

        if (totalUsersElement) {
            totalUsersElement.textContent = data.totalUsers;
        }

        // Initialize Chart.js for sales metrics
        const salesChartCtx = document.getElementById('salesChart')?.getContext('2d');
        if (salesChartCtx) {
            new Chart(salesChartCtx, {
                type: 'bar',
                data: {
                    labels: data.salesMetrics.labels,
                    datasets: [{
                        label: 'Sales (EGP)',
                        data: data.salesMetrics.values,
                        backgroundColor: 'rgba(75, 192, 192, 0.6)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                    }],
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function (value) {
                                    return `EGP ${value}`;
                                },
                            },
                        },
                    },
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    return `EGP ${context.parsed.y}`;
                                },
                            },
                        },
                    },
                },
            });
        } else {
            console.warn('Sales chart canvas not found.');
        }
    } catch (error) {
        console.error('Dashboard Error:', error);
        alert('An error occurred while loading the dashboard. Please try again later.');
    }
});
