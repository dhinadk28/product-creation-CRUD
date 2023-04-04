import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const ProductForm = () => {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const initialValues = {
    name: '',
    price: '',
    description: ''
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    price: Yup.number().required('Price is required').positive().integer(),
    description: Yup.string().required('Description is required')
  });

  const onSubmit = (values, { resetForm }) => {
    if (editing) {
      axios.put(`https://6284a35ca48bd3c40b72cc09.mockapi.io/api/${selectedProduct.id}`, values)
        .then(res => {
          setProducts(products.map(product => (product.id === res.data.id ? res.data : product)));
          setEditing(false);
          setSelectedProduct(null);
          resetForm();
        });
    } else {
      axios.post('https://6284a35ca48bd3c40b72cc09.mockapi.io/api', values)
        .then(res => {
          setProducts([...products, res.data]);
          resetForm();
        });
    }
  };

  const editProduct = (product) => {
    setSelectedProduct(product);
    setEditing(true);
  };

  const deleteProduct = (id) => {
    axios.delete(`https://6284a35ca48bd3c40b72cc09.mockapi.io/api/${id}`)
      .then(res => {
        setProducts(products.filter(product => product.id !== id));
      });
  };

  useEffect(() => {
    axios.get('https://6284a35ca48bd3c40b72cc09.mockapi.io/api')
      .then(res => {
        setProducts(res.data);
      });
  }, []);

  return (
    <div>
      <h1>Product Form</h1>
      <Formik
        initialValues={selectedProduct || initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ errors, touched }) => (
          <Form>
          <div class="mb-3">
            <label for="name" class="form-label">Name:</label>
            <Field type="text" class="form-control" id="name" name="name" />
            <ErrorMessage name="name" class="invalid-feedback" />
          </div>
          <div class="mb-3">
            <label for="price" class="form-label">Price:</label>
            <Field type="text" class="form-control" id="price" name="price" />
            <ErrorMessage name="price" class="invalid-feedback" />
          </div>
          <div class="mb-3">
            <label for="description" class="form-label">Description:</label>
            <Field type="text" class="form-control" id="description" name="description" />
            <ErrorMessage name="description" class="invalid-feedback" />
          </div>
          <button type="submit" class="btn btn-primary">{editing ? 'Update' : 'Create'}</button>
        </Form>
        
        )}
      </Formik>
      <h2>Product List</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Description</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.price}</td>
              <td>{product.description}</td>
              <td>
                <button onClick={() => editProduct(product)}>Edit</button>
                <button onClick={() => deleteProduct
                  (product.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductForm;