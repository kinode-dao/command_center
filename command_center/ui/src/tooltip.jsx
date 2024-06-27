toggleTooltipVisibility();

export function toggleTooltipVisibility() {
    document.addEventListener('DOMContentLoaded', () => {
        const tooltips = document.querySelectorAll('.tooltip');
        tooltips.forEach(tooltip => {
            tooltip.addEventListener('click', () => {
                const tooltipText = tooltip.querySelector('.tooltiptext');
                tooltipText.classList.toggle('visible');
            });
        });
    });
}
