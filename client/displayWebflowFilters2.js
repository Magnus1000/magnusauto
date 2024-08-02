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
        } catch (error) {
            console.error('Error fetching Webflow products:', error);
        }
    }

    return (
        <div>
            <div>
                <button onClick={() => setMake('Honda')} disabled={make === 'Honda'}>Honda</button>
                <button onClick={() => setMake('Acura')} disabled={make === 'Acura'}>Acura</button>
            </div>
            <select value={year} onChange={(e) => setYear(e.target.value)}>
                <option value="">Select Year</option>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <select value={model} onChange={(e) => setModel(e.target.value)}>
                <option value="">Select Model</option>
                {modelsByMake[make].map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <button onClick={fetchWebflowProducts}>Apply Filters</button>
        </div>
    );
}

ReactDOM.render(<Filters />, document.getElementById('vehicleFilters'));