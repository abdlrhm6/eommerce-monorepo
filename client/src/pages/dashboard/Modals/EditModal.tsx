import { useForm } from "react-hook-form"
import { useState ,useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { token } from "../../../utils/token"

import ReactDOM from "react-dom"

export const EditModal = ({ show, id, cancelEdit, categoryName, toEdit }) => {
    const navigate = useNavigate()
    const [error, setError] = useState()
    const [msg, setMsg] = useState()


    const path = toEdit == 'category' ? "/api/categories/category/" + id : "/api/brands/brand/" + id
    const { register, handleSubmit, formState: { errors } ,setValue} = useForm({
        defaultValues: {
            name: categoryName
        }
    })

    useEffect(() => {
        if (categoryName !== null) {
            setValue("name", categoryName);
        }
    }, [categoryName, setValue]);

    const save = async (formData) => {
        setError(null)
        setMsg(null)
        try {
            const response = await fetch(path, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            
            const data = await response.json(); // Parse the JSON response

            if (response.ok && data.success) { // Check if the response is OK
                setMsg(data.success);
            } else {
                setError(data.error || 'An error occurred'); // Handle errors
            }
        } catch (err) {
            setError('Network error occurred'); // Handle network errors
        }
    }

    const hideModal = () => {
        navigate(`/admin/${toEdit == 'category' ? "categories" : "brands"}`)
        cancelEdit(false)
    }
    if (!show || !categoryName) return


    return ReactDOM.createPortal(
        <div className="w-screen h-screen fixed inset-0 bg-black/90 flex items-center justify-center" >
            <form onSubmit={handleSubmit(save)}>

                <h1 className='text-4xl font-bold mb-8 text-white'>Edit</h1>

                {msg && (
                    <p className="px-4 py-5 my-4  bg-green-400 text-green-700">{msg}</p>
                )}
                {error && (
                    <div className="">
                        <p className="px-4 py-5 my-4  bg-red-400 text-red-700">{error}</p>
                    </div>
                )}

                <label htmlFor="name" className='text-white text-sm'> {toEdit} Name</label>
                <input type="text" id="name"
                    placeholder='Category Name' className='block px-4 py-2 outline-none border-2 border-black  w-full focus:outline-none mb-6'
                    
                    {...register("name", {
                        required: true,
                        minLength: 6
                    })}
                />
                {errors.name && errors.name.type === 'required' && (
                    <p className=" my-3 px-4 py-2 bg-red-400 -sm text-red-700">{toEdit} Name is required</p>

                )}

                {errors.name && errors.name.type === 'minLength' && (
                    <p className=" my-3 px-4 py-2 bg-red-400 -sm text-red-700"> At least 6 characters are required.</p>

                )}
                <button type='submit' className="block disabled:bg-gray-500 bg-black text-white px-4 py-2 w-full  my-3"> save</button>
                <button
                    className="block disabled:bg-gray-500 bg-yellow-600 text-white px-4 py-2 w-full  my-3"
                    onClick={() => hideModal()}>close</button>
            </form>
        </div >
    ,document.getElementById("edit-modal"))
}
