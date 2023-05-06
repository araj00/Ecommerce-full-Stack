import React, { useEffect, useState } from "react";
import Layout from "./../../components/Layout/Layout";
import AdminMenu from "./../../components/Layout/AdminMenu";
import CategoryForm from "../../components/Form/CategoryForm";
import { toast } from "react-hot-toast";
import { Modal } from 'antd'
import { instance } from "../../services/api";
import axios from "axios";

const CreateCategory = () => {

  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("")
  const [visible, setVisible] = useState(false)
  const [selected, setSelected] = useState(null)
  const [updatedName, setUpdatedName] = useState("")

  const handleDelete = async (id) => {
  console.log(id)
    try {
      const { data } = await instance.delete(`/api/v1/category/deleteCategory/${id}`)
      if (data?.success) {
        toast.success('category is deleted')
        getAllCategory()
      }
      else {
        toast.error(data.message)
      }
    }

    catch (err) {
      toast.error('something went wrong')
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      const { data } = await instance.put(`/api/v1/category/updateCategory/${selected._id}`,{name : updatedName})
      if (data?.success) {
        toast.success(`${updatedName} is updated`)

        setSelected(null);
        setUpdatedName("");
        setVisible(false);
        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Somtihing went wrong");
    }

  }
  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const {data} = await instance.post('/api/v1/category/addCategory',{name : name},{withCredentials:true})

      if (data?.success) {
        toast.success(`${name} is created`)
        getAllCategory()
      }
      else {
        toast.error(data.message)
      }
    }
    catch (err) {
      console.log(err)
      toast.error('something went wrong in input form')
    }
  }

  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(`/api/v1/category/getAllCategories`)
      if (data?.success) {
        setCategories(data.allCategories);
      }
    }

    catch (err) {
      console.log(err);
      toast.error("something went wrong in getting category")
    }
  }

  useEffect(() => {
    getAllCategory()
  }, [])

  return (
    <Layout title={"Dashboard - Create Category"}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>Manage Category</h1>
            <div className="p-3 w-50">
              <CategoryForm
                handleSubmit={handleSubmit}
                value={name}
                setValue={setName}
              />
            </div>
            <div className="w-75">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories?.map((c) => (
                    <>
                      <tr key={c._id}>
                        <td>{c.name}</td>
                        <td>
                          <button
                            className="btn btn-primary ms-2"
                            onClick={() => {
                              setVisible(true);
                              setUpdatedName(c.name);
                              setSelected(c);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger ms-2"
                            onClick={() => {
                              handleDelete(c._id);
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    </>
                  ))}
                </tbody>
              </table>
            </div>
            <Modal
              onCancel={() => setVisible(false)}
              footer={null}
              open={visible}
            >
              <CategoryForm
                value={updatedName}
                setValue={setUpdatedName}
                handleSubmit={handleUpdate}
              />
            </Modal>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default CreateCategory;