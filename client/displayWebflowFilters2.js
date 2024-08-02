const Filters = () => {
    const [make, setMake] = React.useState('Honda');
    const [year, setYear] = React.useState('');
    const [model, setModel] = React.useState('');

    const years = Array.from({length: 2019 - 1998 + 1}, (_, i) => 1998 + i);

    const modelsByMake = {
        Honda: [
            'Accord', 'Civic', 'CR-V', 'Pilot', 'Odyssey', 'Fit', 'HR-V',
            'Ridgeline', 'Insight', 'Element', 'S2000', 'Passport'
        ],
        Acura: [
            'TL', 'MDX', 'RDX', 'TSX', 'ILX', 'RLX', 'NSX', 'RSX',
            'CL', 'RL', 'ZDX', 'Integra', 'Legend'
        ]
    };

    async function fetchWebflowProducts() {
        console.log(`[${new Date().toISOString()}] Starting fetchWebflowProducts function`);
        try {
            const serverlessUrl = 'https://magnusauto-magnus1000team.vercel.app/api/fetchWebflowFilters2';
            const response = await fetch(`${serverlessUrl}?make=${make}&year=${year}&model=${model}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Fetched Webflow products:', data);

            // Filter products based on returned category IDs
            filterProducts(data.categoryIds);
        } catch (error) {
            console.error('Error fetching Webflow products:', error);
        }
    }

    function filterProducts(categoryIds) {
        const productItems = document.querySelectorAll('.product-item');
        productItems.forEach(item => {
            const categoryId = item.querySelector('.data-attribute-div div').getAttribute('data-category-id');
            if (categoryIds.includes(categoryId)) {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });
    }

    return (
        <div className="filters-wrapper">
            <div className="dual-button-wrapper">
                <button 
                  className={`dual-button left ${make === 'Honda' ? 'selected' : ''}`} 
                  onClick={() => setMake('Honda')} 
                  disabled={make === 'Honda'}
                >
                  Honda
                </button>
                <button 
                  className={`dual-button right ${make === 'Acura' ? 'selected' : ''}`} 
                  onClick={() => setMake('Acura')} 
                  disabled={make === 'Acura'}
                >
                  Acura
                </button>
            </div>
            <select className="dropdown-field-dark w-select" value={year} onChange={(e) => setYear(e.target.value)}>
                <option value="">Select Year</option>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <select className="dropdown-field-dark w-select" value={model} onChange={(e) => setModel(e.target.value)}>
                <option value="">Select Model</option>
                {modelsByMake[make].map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <button className="outline-button" onClick={fetchWebflowProducts}>Apply Filters</button>
        </div>
    );
}

ReactDOM.render(React.createElement(Filters), document.getElementById('vehicleFilters'));