// import { useState } from "react"
// import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
// import { GOOGLE_PLACES_KEY } from "../../config";
// export default function AdForm({action,type}) { 
//     //state
//     const [ad,setAd] = useState({
//         photos:[],
//         uploading: false,
//         price:'',
//         address:'',
//         bedrooms:'',
//         bathrooms:'',
//         carpark:'',
//         landSize:'',
//         type:'',
//         title:'',
//         description:'',
//         loading:false,
//     })
//     return (
//         <>
//         <div className="mb-3 form-control">
//             <GooglePlacesAutocomplete 
//                 apiKey={GOOGLE_PLACES_KEY} 
//                 apiOptions="au"
//                 selectProps={{defaultInputValue: ad?.address,
//                     placeholder: "Search for address...",
//                     onChange:(data)=>console.log(data),
//                 }}  
//             />
//         </div>
//         </>
//     )
//  }

import { useState } from "react";
import AsyncSelect from "react-select/async"; // react-select's async select component
import CurrencyInput from 'react-currency-input-field';

export default function AdForm({ action, type }) {
    // state
    const [ad, setAd] = useState({
        photos: [],
        uploading: false,
        price: '',
        address: '',
        bedrooms: '',
        bathrooms: '',
        carpark: '',
        landSize: '',
        type: '',
        title: '',
        description: '',
        loading: false,
    });

    // Fetch suggestions from OpenStreetMap Nominatim API
    const fetchSuggestions = async (inputValue) => {
        if (!inputValue) return [];
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${inputValue}`
        );
        const data = await response.json();
        return data.map((place) => ({
            label: place.display_name,
            value: place.display_name,
            lat: place.lat,
            lon: place.lon,
        }));
    };

    // Handle address selection
    const handleAddressChange = (selectedOption) => {
        setAd((prevAd) => ({
            ...prevAd,
            address: selectedOption ? selectedOption.value : "",
        }));
        console.log("Selected Address:", selectedOption);
    };

    return (
        <>
            <div className="mb-3 form-control">
                <AsyncSelect
                    cacheOptions
                    loadOptions={fetchSuggestions}
                    defaultOptions
                    placeholder="Search for address..."
                    onChange={handleAddressChange}
                    value={ad.address ? { label: ad.address, value: ad.address } : null}
                />
            </div>
            <CurrencyInput placeholder="Enter Price" 
            defaultValue={ad.price} 
            className="form-control mb-3"
            onValueChange={(value) => setAd({...ad,price:value})}/>

            <input 
            type="number" 
            min="0" 
            className="form-control mb-3" 
            placeholder="Enter how many bedrooms" 
            value={ad.bedrooms}
            onChange={(e) => setAd({...ad,bedrooms:e.target.value})}
            />
            <input 
            type="number" 
            min="0" 
            className="form-control mb-3" 
            placeholder="Enter how many bathrooms" 
            value={ad.bathrooms}
            onChange={(e) => setAd({...ad,bathrooms:e.target.value})}
            />
            <input 
            type="number" 
            min="0" 
            className="form-control mb-3" 
            placeholder="Enter how many carparks" 
            value={ad.carpark}
            onChange={(e) => setAd({...ad,carpark:e.target.value})}
            />
            <input 
            type="text" 
            className="form-control mb-3" 
            placeholder="Size of land" 
            value={ad.landSize}
            onChange={(e) => setAd({...ad,landSize:e.target.value})}
            />
            <input 
            type="text" 
            className="form-control mb-3" 
            placeholder="Enter Title" 
            value={ad.title}
            onChange={(e) => setAd({...ad,title:e.target.value})}
            />
            <textarea 
            className="form-control mb-3" 
            placeholder="Enter Description" 
            value={ad.description}
            onChange={(e) => setAd({...ad,description:e.target.value})}
            />
            <button className="btn btn-primary">Submit</button>
            <pre className="">{JSON.stringify(ad,null,4)}</pre>
        </>
    );
}
