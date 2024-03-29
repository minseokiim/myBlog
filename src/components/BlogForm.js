import { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory, useParams } from 'react-router-dom';
import propTypes from 'prop-types';

const BlogForm = ({ editing, addToast }) => {
  const history = useHistory();
  const { id } = useParams();
  const [originalTitle, setOriginalTitle] = useState('');
  const [originalBody, setOriginalBody] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [publish, setPublish] = useState(false);
  const [originalPublish, setOriginalPublish] = useState(false);
  const [titleError, setTitleError] = useState(false);
  const [bodyError, setBodyError] = useState(false);
  //const [toasts, setToasts] = useState([]);
  // const [, setToastRerender] = useState(false);
  // const toasts = useRef([]);

  useEffect(() => {
    if (editing) {
      axios.get(`http://localhost:3001/posts/${id}`).then((res) => {
        setTitle(res.data.title);
        setBody(res.data.body);
        setPublish(res.data.publish);
        setOriginalTitle(res.data.title);
        setOriginalBody(res.data.body);
        setOriginalPublish(res.data.publish);
      });
    }
  }, [id, editing]);

  const isEdited = () => {
    return (
      title !== originalTitle ||
      body !== originalBody ||
      publish !== originalPublish
    );
  };

  const goBack = () => {
    if (editing) {
      history.push(`/blogs/${id}`);
    } else {
      history.push('/blogs');
    }
  };

  const validateForm = () => {
    let validated = true;

    if (title === '') {
      setTitleError(true);
      validated = false;
    }
    if (body === '') {
      setBodyError(true);
      validated = false;
    }

    return validated;
  };

  // const deleteToast = (id) => {
  //   const filteredToasts = toasts.current.filter((toast) => {
  //     return toast.id != id;
  //   });

  //   toasts.current = filteredToasts;
  //   setToastRerender((prev) => !prev);
  //   //setToasts(filteredToasts);
  // };

  // const addToast = (toast) => {
  //   const id = uuidv4();
  //   const toastWithId = {
  //     ...toast,
  //     id,
  //   };
  //   toasts.current = [...toasts.current, toastWithId];
  //   setToastRerender((prev) => !prev);
  //   //setToasts((prev) => [...prev, toastWithId]);

  //   setTimeout(() => {
  //     deleteToast(id, toasts, setToastRerender);
  //   }, 5000);
  // };

  const onSubmit = () => {
    setTitleError(false);
    setBodyError(false);
    if (validateForm()) {
      if (editing) {
        axios
          .patch(`http://localhost:3001/posts/${id}`, {
            title,
            body,
            publish,
          })
          .then((res) => {
            history.push(`/blogs/${id}`);
          });
      } else {
        axios
          .post('http://localhost:3001/posts', {
            title,
            body,
            publish,
            createdAt: Date.now(),
          })
          .then(() => {
            addToast({
              type: 'success',
              text: 'Successfully created',
            });
            history.push('/admin');
          });
      }
    }
  };

  const onChangePublish = (e) => {
    setPublish(e.target.checked);
  };

  return (
    <div>
      {/* <Toast toasts={toasts} deleteToast={deleteToast} /> */}
      <h1>{editing ? 'Edit' : 'Create'} a blog post</h1>
      <div className="mb-3">
        <label className="form-label">Title</label>
        <input
          className={`form-control ${titleError ? 'border-danger' : ''}`}
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
          }}
        />
        {titleError && <div className="text-danger">Title is required.</div>}
      </div>
      <div className="mb-3">
        <label className="form-label">Body</label>
        <textarea
          className={`form-control ${bodyError ? 'border-danger' : ''}`}
          value={body}
          onChange={(event) => {
            setBody(event.target.value);
          }}
          rows="10"
        />
        {bodyError && <div className="text-danger">Body is required.</div>}
      </div>

      <div className="form-check mb-3">
        <input
          className="form-check-input"
          type="checkbox"
          checked={publish}
          onChange={onChangePublish}
        />
        <label className="form-check-label">Publish</label>
      </div>

      <button
        className="btn btn-primary"
        onClick={onSubmit}
        disabled={editing && !isEdited()}
      >
        {editing ? 'Edit' : 'Post'}
      </button>

      <button className="btn btn-danger ms-2" onClick={goBack}>
        Cancel
      </button>
    </div>
  );
};

BlogForm.propTypes = {
  editing: propTypes.bool,
};

BlogForm.defaultTypes = {
  editing: false,
};

export default BlogForm;
