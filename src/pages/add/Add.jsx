import React, { useReducer, useState } from 'react'
import './Add.scss'
import { gigReducer, INITIAL_STATE } from '../../reducers/gigReducer'
import upload from '../../utils/upload'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import newRequest from '../../utils/newRequest'
import { useNavigate } from 'react-router-dom'

const Add = () => {
  const [singleFile, setSingleFile] = useState(undefined)
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const navigate = useNavigate()
  const [state, dispatch] = useReducer(gigReducer, INITIAL_STATE)
  const [error, setError] = useState({})
  const handleChange = e => {
    if (error.type === e.target.name) setError({})
    dispatch({
      type: 'CHANGE_INPUT',
      payload: { name: e.target.name, value: e.target.value },
    })
  }
  console.log(state)
  const handleFeature = e => {
    e.preventDefault()
    dispatch({
      type: 'ADD_FEATURE',
      payload: e.target[0].value,
    })
    e.target[0].value = ''
  }
  const handleUpload = async () => {
    setUploading(true)
    try {
      const cover = await upload(singleFile)
      const images = await Promise.all(
        [...files].map(async file => {
          const url = await upload(file)
          return url
        })
      )
      dispatch({ type: 'ADD_IMAGES', payload: { cover, images } })
    } catch (error) {
      console.log(error)
    } finally {
      setUploading(false)
    }
  }
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: gig => {
      if (!gig.title) {
        setError({ type: 'title', message: 'Title is required' })
        throw new Error('ignore')
      }
      if (!gig.cat) {
        setError({ type: 'cat', message: 'Category is required' })
        throw new Error('ignore')
      }
      if (!gig.desc) {
        setError({ type: 'desc', message: 'Description is required' })
        throw new Error('ignore')
      }
      if (!gig.shortTitle) {
        setError({ type: 'shortTitle', message: 'Service Title is required' })
        throw new Error('ignore')
      }
      if (!gig.shortDesc) {
        setError({ type: 'shortDesc', message: 'Short Description is required' })
        throw new Error('ignore')
      }
      if (!gig.deliveryTime) {
        setError({ type: 'deliveryTime', message: 'Delivery Time is required' })
        throw new Error('ignore')
      }
      if (!gig.revisionNumber) {
        setError({ type: 'revisionNumber', message: 'Revision Number is required' })
        throw new Error('ignore')
      }
      if (!gig.price) {
        setError({ type: 'price', message: 'Price is required' })
        throw new Error('ignore')
      }

      return newRequest.post('/gigs', gig)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['myGigs'])
      navigate('/mygigs')
    },
    onError: error => {
      console.error('Gig creation failed:', error)
      if (error === 'ignore') return
      if (typeof error !== 'string') return
      setError({ type: 'server', message: error })
    },
  })
  const handleSubmit = e => {
    e.preventDefault()
    mutation.mutate(state)
  }

  return (
    <div className="add">
      <div className="container">
        <div className="flex">
          <h1>Add New Gig</h1>
          {error.type === 'server' && <span className="error">{error.message}</span>}
        </div>
        <div className="sections">
          <div className="info">
            <label htmlFor="">Title</label>
            <input
              type="text"
              name="title"
              placeholder="e.g. I will do something I'm really good at"
              className={error.type === 'title' ? 'error' : undefined}
              onChange={handleChange}
            />
            {error.type === 'title' && <span className="error">{error.message}</span>}
            <label htmlFor="">Category</label>
            <select
              className={error.type === 'cat' ? 'error' : undefined}
              name="cat"
              id="cat"
              onChange={handleChange}
              defaultValue="design"
            >
              <option value="animation">Animation</option>
              <option value="web">Web Development</option>
              <option value="design">Design</option>
              <option value="music">Music</option>
            </select>
            {error.type === 'cat' && <span className="error">{error.message}</span>}
            <div className="images">
              <div className="imagesInputs">
                <label htmlFor="">Cover Image</label>
                <input type="file" onChange={e => setSingleFile(e.target.files[0])} />
                <label htmlFor="">Upload Images</label>
                <input type="file" multiple onChange={e => setFiles(e.target.files)} />
              </div>
              <button onClick={handleUpload}>{uploading ? 'uploading' : 'Upload'}</button>
            </div>
            <label htmlFor="">Description</label>
            <textarea
              name="desc"
              id=""
              placeholder="Brief descriptions to introduce your service to customers"
              cols="0"
              rows="16"
              className={error.type === 'desc' ? 'error' : undefined}
              onChange={handleChange}
            ></textarea>
            {error.type === 'desc' && <span className="error">{error.message}</span>}
            <button onClick={handleSubmit}>Create</button>
          </div>
          <div className="details">
            <label htmlFor="">Service Title</label>
            <input
              type="text"
              name="shortTitle"
              placeholder="e.g. One-page web design"
              onChange={handleChange}
              className={error.type === 'shortTitle' ? 'error' : undefined}
            />
            {error.type === 'shortTitle' && <span className="error">{error.message}</span>}
            <label htmlFor="">Short Description</label>
            <textarea
              name="shortDesc"
              onChange={handleChange}
              id=""
              placeholder="Short description of your service"
              cols="30"
              rows="10"
              className={error.type === 'shortDesc' ? 'error' : undefined}
            ></textarea>
            {error.type === 'shortDesc' && <span className="error">{error.message}</span>}
            <label htmlFor="">Delivery Time (e.g. 3 days)</label>
            <input
              type="number"
              name="deliveryTime"
              onChange={handleChange}
              className={error.type === 'deliveryTime' ? 'error' : undefined}
            />
            {error.type === 'deliveryTime' && <span className="error">{error.message}</span>}
            <label htmlFor="">Revision Number</label>
            <input
              type="number"
              name="revisionNumber"
              onChange={handleChange}
              className={error.type === 'revisionNumber' ? 'error' : undefined}
            />
            {error.type === 'revisionNumber' && <span className="error">{error.message}</span>}
            <label htmlFor="">Add Features</label>
            <form action="" className="add" onSubmit={handleFeature}>
              <input type="text" placeholder="e.g. page design" />
              <button type="submit">add</button>
            </form>
            <div className="addedFeatures">
              {state?.features?.map(f => (
                <div className="item" key={f}>
                  <button onClick={() => dispatch({ type: 'REMOVE_FEATURE', payload: f })}>
                    {f}
                    <span>X</span>
                  </button>
                </div>
              ))}
            </div>
            <label htmlFor="">Price</label>
            <input
              type="number"
              onChange={handleChange}
              name="price"
              className={error.type === 'price' ? 'error' : undefined}
            />
            {error.type === 'price' && <span className="error">{error.message}</span>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Add
