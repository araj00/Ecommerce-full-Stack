import { Layout } from 'antd'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import AdminMenu from '../../components/Layout/AdminMenu'
import { Link } from 'react-router-dom'
import axios from 'axios'

const Product = () => {

    const [products, setProducts] = useState([])

    const getAllProducts = async () => {
        const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/getAllProducts`)

        if (data?.success) {
            setProducts(data?.products)
            toast.success(data?.message)
        }
        else {
            toast.error(data?.message)
        }
    }

    useEffect(() => {
        getAllProducts()
    }, [])
    return (
        <Layout>
            <div className="row">
                <div className="col-md-3">
                    <AdminMenu />
                </div>
                <div className="col-md-9 ">
                    <h1 className="text-center">All Products List</h1>
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
                                        <p className="card-text">{p.description}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Product