import React from 'react';

const ListItem = (props) => {
    return <li className="list-group-item">
      <button
        onClick={props.editToDo}
        className="btn-sm btn btn-warning float-left" >
        Update
      </button>
      {props.item.name}
      <button
        onClick={ props.deleteToDo}
        className="btn-sm btn btn-danger float-right" >
        X
      </button>
    </li>
};


export default ListItem;