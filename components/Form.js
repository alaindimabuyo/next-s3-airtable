import React from 'react'
import { gql } from "@apollo/client";
import { useMutation } from '@apollo/react-hooks';
import {useForm} from 'react-hook-form'

export default function Form({showModal}) {




const GET_PULP = gql`
    query GetData {
      pulp {
        bio
        id
        name
        photo
      }
    }
`;

const { register, formState: { errors }, handleSubmit } = useForm();
console.log(errors)

const ADD_PULP = gql`
    mutation AddEntry ($bio: String!, $name: String!, $photo: [JSON]){
      insert_pulp(bio: $bio, name: $name, photo: $photo) {
        bio
        id
        name
        photo
      }
    }

`;

const [addEntry] = useMutation(ADD_PULP, {
  onCompleted: () => {
    console.log('success')
  },
  onError: (error) => {
   console.log('error', error)
  },
});

const [urlImage, setUrlImage] = React.useState('')
console.log('urlImage', urlImage)
const onSubmit = (e) => {

 

  console.log('e', e)
    const {name, bio} = e
    addEntry({
      variables: {
        name: name,
        bio: bio,
        photo: {url: urlImage}
      },
    });
    showModal(false)
}
const [file, setFile] = React.useState(null)

 const uploadPhoto = async (e) => {
  
    const file = e.target.files[0];
    const filename = encodeURIComponent(file.name);
    const res = await fetch(`/api/upload-url?file=${filename}`);
    const { url, fields } = await res.json();
    const formData = new FormData();

    setFile(URL.createObjectURL(file))

    Object.entries({ ...fields, file }).forEach(([key, value]) => {
      formData.append(key, value);
    });
   
    const upload = await fetch(url, {
      method: 'POST',
      body: formData,
      headers: {
        'Access-Control-Allow-Origin': '*',            
      }
    });

    setUrlImage(upload.url)
    if (upload.ok) {
      console.log('Uploaded successfully!');
    } else {
      console.error('Upload failed.');
    }
  };

    return (
      <>
        <div>
          <div className="md:grid md:grid-cols-1 md:gap-12">
            <div className="mt-12 md:mt-0 md:col-span-12">
              <form action="#" method="POST" onSubmit={handleSubmit(onSubmit)}>
                <div className="shadow sm:rounded-md sm:overflow-hidden">
                  <div className="px-12 py-12 bg-white space-y-12 sm:p-12">
                    <div className="grid grid-cols-3 gap-6">
                    <div className="col-span-12 sm:col-span-3">
                      <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                        Name
                      </label>
                      <input
                        type="text"
                        {...register("name", { required: true, maxLength: 20 })}
                        id="first_name"
                        style={{borderColor: errors.name? 'red': ''}}
                        autoComplete="given-name"
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                      {errors.name && 'Required'}
                    </div>

                    </div>
  
                    <div>
                      <label htmlFor="about" className="block text-sm font-medium text-gray-700">
                        Bio
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="about"
                          {...register("bio")}
                          rows={3}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder="you@example.com"
                          defaultValue={''}
                        />
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        Brief description for your profile
                      </p>
                    </div>
  
                  
                 
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Cover photo</label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1">
                        {urlImage ? (
                          <div>
                            <img className="justify-center" style={{"width": "50%"}} src={file}></img>
                            <button className="text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500  py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md" onClick={() => setUrlImage('')}>Remove Image</button>
                          </div>
                          ) : (
                          <>
                           <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                            aria-hidden="true"
                          >
                            <path
                              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <div className="flex text-sm text-gray-600">
                            <label
                              htmlFor="file-upload"
                              className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                            >
                              <span>Upload a file</span>
                              <input id="file-upload" 
                                 {...register("photo")}
                                type="file" 
                                className="sr-only"  
                                onChange={uploadPhoto}
                                accept="image/png, image/jpeg" />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                          </>
                        ) }
                         
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                    <button
                      type="submit"
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
  
        <div className="hidden sm:block" aria-hidden="true">
          <div className="py-5">
            <div className="border-t border-gray-200" />
          </div>
        </div>
        {/* <button onClick={toggleTodoMutation()}>asd</button> */}
      
      </>
    )
  }