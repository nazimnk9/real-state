import { useState } from "react";
import AsyncSelect from "react-select/async"; // react-select's async select component
import CurrencyInput from "react-currency-input-field";
import ImageUpload from "./ImageUpload";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function AdForm({ action, type }) {
  // state
  const [ad, setAd] = useState({
    photos: [],
    uploading: false,
    price: "",
    address: "",
    bedrooms: "",
    bathrooms: "",
    carpark: "",
    landSize: "",
    title: "",
    description: "",
    loading: false,
    type,
    action,
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

  const handleClick = async () => {
    try {
      setAd({ ...ad, loading: true });
      const { data } = await axios.post("/ad", ad);
      console.log("Ad create response => ", data);

      if (data?.error) {
        toast.error(data?.error);
        setAd({ ...ad, loading: false });
      } else {
        toast.success("Ad Created Successfully.");
        setAd({ ...ad, loading: false });
        //navigate("/dashboard")
      }
    } catch (err) {
      console.log(err);
      setAd({ ...ad, loading: false });
    }
  };

  return (
    <>
      <div className="mb-3 form-control">
        <ImageUpload ad={ad} setAd={setAd} />
        <AsyncSelect
          cacheOptions
          loadOptions={fetchSuggestions}
          defaultOptions
          placeholder="Search for address..."
          onChange={handleAddressChange}
          value={ad.address ? { label: ad.address, value: ad.address } : null}
        />
      </div>
      <div style={{marginTop: "80px"}}>
        <CurrencyInput
          placeholder="Enter Price"
          defaultValue={ad.price}
          className="form-control mb-3"
          onValueChange={(value) => setAd({ ...ad, price: value })}
        />
      </div>

      <input
        type="number"
        min="0"
        className="form-control mb-3"
        placeholder="Enter how many bedrooms"
        value={ad.bedrooms}
        onChange={(e) => setAd({ ...ad, bedrooms: e.target.value })}
      />
      <input
        type="number"
        min="0"
        className="form-control mb-3"
        placeholder="Enter how many bathrooms"
        value={ad.bathrooms}
        onChange={(e) => setAd({ ...ad, bathrooms: e.target.value })}
      />
      <input
        type="number"
        min="0"
        className="form-control mb-3"
        placeholder="Enter how many carparks"
        value={ad.carpark}
        onChange={(e) => setAd({ ...ad, carpark: e.target.value })}
      />
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Size of land"
        value={ad.landSize}
        onChange={(e) => setAd({ ...ad, landSize: e.target.value })}
      />
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Enter Title"
        value={ad.title}
        onChange={(e) => setAd({ ...ad, title: e.target.value })}
      />
      <textarea
        className="form-control mb-3"
        placeholder="Enter Description"
        value={ad.description}
        onChange={(e) => setAd({ ...ad, description: e.target.value })}
      />
      <button onClick={handleClick} className="btn btn-primary">
        Submit
      </button>
      <pre className="">{JSON.stringify(ad, null, 4)}</pre>
    </>
  );
}
