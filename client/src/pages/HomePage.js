import React, { useEffect, useState } from "react";
import Link from "antd/es/typography/Link";
import Layout from "./../components/Layout/Layout";
import axios from "axios";
import { Checkbox, Radio } from "antd";
import {Prices} from '../components/Prices'


const HomePage = () => {

  const [products, setProducts] = useState([])
  const [loading,setLoading] = useState(false)
  const [categories,setCategories] = useState([])
  const [checked,setChecked] = useState([])
  const [radio,setRadio] = useState("")
  const [total,setTotal] = useState(0);
  const [page,setPage] = useState(1)
  
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(`/api/v1/category/getAllCategories`)
      if (data?.success) {
        setCategories(data.allCategories);
      }
    }

    catch (err) {
      console.log(err);
    }
  }

  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(`/api/v1/product/product-list/?page=${page}`);
      setLoading(false);
      setProducts([...products, ...data?.products]);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMore();
  }, [page]);
  
 

  const getTotalProducts = async() => {
    try{
      const { data } = await axios.get(`/api/v1/product/totalProductCount`)
      if (data?.success) {
        setTotal(data.total);
      }
    }
    catch(err){
      console.log(err);
    }
  }

  const handleFilter = async(value,id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all = all.filter((c) => c !== id);
    }
    setChecked(all);

  } 

  const getFilterProducts = async() => {
    try{
    const {data} = await axios.post(`${process.env.REACT_APP_API}/api/v1/product/filterProduct`,{
      checked,radio
    })
    if(data?.success){
      setProducts(data.products)
    }
  }
  catch(err){
    console.log(err)
  }
  }

  const getAllProducts = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/getAllProducts`)

      if (data?.success) {
        setProducts(data?.products)
      }
    }
    catch (err) {
      console.log(err)
    }

  }

  useEffect(() => {
    getAllCategory();
    getTotalProducts()
  },[])

  useEffect(() => {
     if(!checked.length && !radio.length){
      getAllProducts()
     }
     else{
      getFilterProducts()
     }
  }, [checked,radio])

 


  return (
    <Layout title={"Best offers "}>
      <div className="container-fluid row mt-3">
        <div className="col-md-2">
          <h4 className="text-center">Filter By Category</h4>
          <div className="d-flex flex-column">
            {categories?.map((c) => (
              <Checkbox
                key={c._id}
                onChange={(e) => handleFilter(e.target.checked, c._id)}
              >
                {c.name}
              </Checkbox>
            ))}
          </div>
          <h4 className="text-center mt-4">Filter By Price</h4>
          <div className="d-flex flex-column">
            <Radio.Group onChange={(e) => setRadio(e.target.value)}>
              {Prices?.map((p) => (
                <div key={p._id}>
                  <Radio value={p.array}>{p.name}</Radio>
                </div>
              ))}
            </Radio.Group>
          </div>
          <div className="d-flex flex-column">
            <button
              className="btn btn-danger"
              onClick={() => window.location.reload()}
            >
              RESET FILTERS
            </button>
          </div>
        </div>
      </div>
      <div className="col-md-9">
        <h1 className="text-center">All Products</h1>
        <div className="d-flex flex-wrap">
        {products?.map((p) => (
          <Link
            key={p._id}
            to={`/dashboard/admin/product/${p.slug}`}
            className="product-link"
          >
            <div className="card m-2" style={{ width: "18rem" }}>
              <img
                src={`${p.image}`}
                className="card-img-top"
                alt={p.name}
              />
              <div className="card-body">
                <h5 className="card-title">{p.name}</h5>
                <p className="card-text"> {p.description.substring(0, 30)}...</p>
                <p className="card-text"> $ {p.price}</p>
                <button className="btn btn-primary ms-1">More Details</button>
                <button className="btn btn-secondary ms-1">ADD TO CART</button>
              </div>
            </div>
          </Link>
        ))}
         <div className="m-2 p-3">
            {products && products.length < total && (
              <button
                className="btn btn-warning"
                onClick={(e) => {
                  e.preventDefault();
                  setPage(page + 1);
                }}
              >
                {loading ? "Loading ..." : "Loadmore"}
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
