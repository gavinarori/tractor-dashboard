import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { PropagateLoader } from 'react-spinners';
import toast from 'react-hot-toast';
import { get_category } from '../../store/Reducers/categoryReducer';
import { get_product, messageClear, update_product, product_image_update } from '../../store/Reducers/productReducer';
import { overrideStyle } from '../../utils/utils';

const EditProduct = () => {
    const { productId } = useParams();
    const dispatch = useDispatch();
    const { categorys = [] } = useSelector(state => state.category);
    const { product, loader, errorMessage, successMessage } = useSelector(state => state.product);

    const [state, setState] = useState({
        name: '',
        description: '',
        discount: '',
        price: '',
        brand: '',
        stock: '',
        city: '',
        state: '',
        country: '',
    });

    const [cateShow, setCateShow] = useState(false);
    const [category, setCategory] = useState('');
    const [allCategory, setAllCategory] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [imageShow, setImageShow] = useState([]);

    useEffect(() => {
        dispatch(get_category({ searchValue: '', parPage: '', page: '' }));
    }, [dispatch]);

    useEffect(() => {
        dispatch(get_product(productId));
    }, [productId, dispatch]);

    useEffect(() => {
        if (product) {
            setState({
                name: product.name,
                description: product.description,
                discount: product.discount,
                price: product.price,
                brand: product.brand,
                stock: product.stock,
                city: product.location?.city || '',
                state: product.location?.state || '',
                country: product.location?.country || '',
            });
            setCategory(product.category);
            setImageShow(product.images || []);
        }
    }, [product]);

    useEffect(() => {
        if (categorys.length > 0) {
            setAllCategory(categorys);
        }
    }, [categorys]);

    useEffect(() => {
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
        }
    }, [successMessage, errorMessage, dispatch]);

    const inputHandle = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value,
        });
    };

    const categorySearch = (e) => {
        const value = e.target.value;
        setSearchValue(value);
        if (value) {
            const filteredCategories = categorys.filter(c => c.name.toLowerCase().includes(value.toLowerCase()));
            setAllCategory(filteredCategories);
        } else {
            setAllCategory(categorys);
        }
    };

    const changeImage = (img, files) => {
        if (files && files.length > 0) {
            dispatch(product_image_update({
                oldImage: img,
                newImage: files[0],
                productId,
            }));
        }
    };

    const update = (e) => {
        e.preventDefault();
        const obj = {
            name: state.name,
            description: state.description,
            discount: state.discount,
            price: state.price,
            brand: state.brand,
            stock: state.stock,
            city: state.city,
            state: state.state,
            country: state.country,
            productId,
        };
        dispatch(update_product(obj));
    };

    return (
        <div className='px-2 lg:px-7 pt-5'>
            <div className='w-full p-4 bg-[#283046] rounded-md'>
                <div className='flex justify-between items-center pb-4'>
                    <h1 className='text-[#d0d2d6] text-xl font-semibold'>Edit Product</h1>
                    <Link className='bg-blue-500 hover:shadow-blue-500/50 hover:shadow-lg text-white rounded-sm px-7 py-2 my-2' to='/seller/dashboard/products'>Products</Link>
                </div>
                <form onSubmit={update}>
                    <div className='flex flex-col mb-3 md:flex-row gap-4 w-full text-[#d0d2d6]'>
                        <div className='flex flex-col w-full md:w-1/3 gap-1'>
                            <label htmlFor="name">Product name</label>
                            <input className='px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]' onChange={inputHandle} value={state.name} type="text" placeholder='Product name' name='name' id='name' />
                        </div>
                        <div className='flex flex-col w-full md:w-1/3 gap-1'>
                            <label htmlFor="brand">Product brand</label>
                            <input className='px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]' onChange={inputHandle} value={state.brand} type="text" placeholder='Product brand' name='brand' id='brand' />
                        </div>
                        <div className='flex flex-col w-full md:w-1/3 gap-1'>
                            <label htmlFor="city">City</label>
                            <input className='px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]' onChange={inputHandle} value={state.city} type="text" placeholder='City' name='city' id='city' />
                        </div>
                    </div>
                    <div className='flex flex-col mb-3 md:flex-row gap-4 w-full text-[#d0d2d6]'>
                        <div className='flex flex-col w-full md:w-1/3 gap-1'>
                            <label htmlFor="state">State</label>
                            <input className='px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]' onChange={inputHandle} value={state.state} type="text" placeholder='State' name='state' id='state' />
                        </div>
                        <div className='flex flex-col w-full md:w-1/3 gap-1'>
                            <label htmlFor="country">Country</label>
                            <input className='px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]' onChange={inputHandle} value={state.country} type="text" placeholder='Country' name='country' id='country' />
                        </div>
                    </div>
                    <div className='flex flex-col mb-3 md:flex-row gap-4 w-full text-[#d0d2d6]'>
                        <div className='flex flex-col w-full gap-1 relative'>
                            <label htmlFor="category">Category</label>
                            <input readOnly onClick={() => setCateShow(!cateShow)} className='px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]' onChange={inputHandle} value={category} type="text" placeholder='--select category--' id='category' />
                            <div className={`absolute top-[101%] bg-slate-800 w-full transition-all ${cateShow ? 'scale-100' : 'scale-0'}`}>
                                <div className='w-full px-4 py-2 fixed'>
                                    <input value={searchValue} onChange={categorySearch} className='px-3 py-1 w-full focus:border-indigo-500 outline-none bg-transparent border border-slate-700 rounded-md text-[#d0d2d6] overflow-hidden' type="text" placeholder='search' />
                                </div>
                                <div className='pt-14'></div>
                                <div className='flex justify-start items-start flex-col h-[200px] overflow-x-scrool'>
                                    {allCategory.length > 0 && allCategory.map((c, i) => (
                                        <span key={i} className={`px-4 py-2 hover:bg-indigo-500 hover:text-white hover:shadow-lg w-full cursor-pointer ${category === c.name && 'bg-indigo-500'}`} onClick={() => {
                                            setCateShow(false);
                                            setCategory(c.name);
                                            setSearchValue('');
                                            setAllCategory(categorys);
                                        }}>
                                            {c.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-col w-full gap-1'>
                            <label htmlFor="stock">Stock</label>
                            <input className='px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]' onChange={inputHandle} value={state.stock} type="number" min='0' placeholder='Product stock' name='stock' id='stock' />
                        </div>
                    </div>
                    <div className='flex flex-col mb-3 md:flex-row gap-4 w-full text-[#d0d2d6]'>
                        <div className='flex flex-col w-full gap-1'>
                            <label htmlFor="price">Price</label>
                            <input className='px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]' onChange={inputHandle} value={state.price} type="number" placeholder='Price' name='price' id='price' />
                        </div>
                        <div className='flex flex-col w-full gap-1'>
                            <label htmlFor="discount">Discount</label>
                            <input className='px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]' onChange={inputHandle} value={state.discount} type="number" placeholder='%Discount%' name='discount' id='discount' />
                        </div>
                    </div>
                    <div className='flex flex-col w-full gap-1 text-[#d0d2d6] mb-5'>
                        <label htmlFor="description">Description</label>
                        <textarea rows={4} className='px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]' onChange={inputHandle} value={state.description} placeholder='Description' name='description' id='description'></textarea>
                    </div>
                    <div className='grid lg:grid-cols-4 grid-cols-1 md:grid-cols-3 sm:grid-cols-2 sm:gap-4 md:gap-4 xs:gap-4 gap-3 w-full text-[#d0d2d6] mb-4'>
                        {imageShow && imageShow.length > 0 && imageShow.map((img, i) => (
                            <div key={i}>
                                <label className='h-[180px]' htmlFor={i}>
                                    <img className='h-full' src={img} alt="" />
                                </label>
                                <input onChange={(e) => changeImage(img, e.target.files)} type="file" id={i} className='hidden' />
                            </div>
                        ))}
                    </div>
                    <div className='flex'>
                        <button disabled={loader} className='bg-blue-500 w-[190px] hover:shadow-blue-500/20 hover:shadow-lg text-white rounded-md px-7 py-2 mb-3'>
                            {loader ? <PropagateLoader color='#fff' cssOverride={overrideStyle} /> : 'Update Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProduct;
