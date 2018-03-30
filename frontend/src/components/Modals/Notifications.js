import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
import axios from "axios";
import { Link } from "react-router-dom";

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    width                 : '25%',
    textAlign             : 'center'
  }
};

Modal.setAppElement('#root')

class Notifications extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      modalIsOpen: false,
      seenComments: false,
      seenFavorites: false,
      seenFollowers: false
    }
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  openModal() {
    this.setState({modalIsOpen: true});
  }

  closeModal() {
    this.setState({modalIsOpen: false, message: ''});
    axios
      .patch(`/users/seenFavoritesChangeByUserId/${this.props.id}`)
      .then( () => {
        this.setState({
          seenFavorites: false
        })
      })
      .then( () => {
        axios
          .patch(`/users/seenFollowersChangeByUserId/${this.props.id}`)
          .then( () => {
            this.setState({
              seenFollowers: false
            })
          })
      })
      .catch( (err) => {
        console.log(err);
      })
  }

  componentDidMount() {
    axios
      .get(`/users/seenComments/${this.props.id}`)
      .then( (res) => {
        this.setState({
          seenComments: res.data
        })
      })
      .then( () => {
        axios
          .get(`/users/seenFavorites/${this.props.id}`)
          .then( (res) => {
            this.setState({
              seenFavorites: res.data
            })
          })
      })
      .then( () => {
        axios
          .get(`/users/seenFollowers/${this.props.id}`)
          .then( (res) => {
            this.setState({
              seenFollowers: res.data
            })
          })
      })
      .catch( (err) => {
        console.log(err);
      })
  }

  handleFormInput = e => {
    const { confirmpassword, password, message } = this.state
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  render() {
    const { seenComments, seenFavorites, seenFollowers } = this.state
    var notificationButton = seenComments.length > 0 || seenFavorites.length > 0 || seenFollowers.length >  0? "New Notifications": "No Notifications";
    var notificationClass = seenComments.length > 0 || seenFavorites.length > 0 || seenFollowers.length >  0? "button formButton alert": "button formButton";
    return (
      <div className="Modal">
        <div>
          <button className={notificationClass} onClick={this.openModal}>{notificationButton}</button>
          <Modal
            isOpen={this.state.modalIsOpen}
            onRequestClose={this.closeModal}
            style={customStyles}
            >
            <h3>Hi {this.props.user}!</h3>
            <ul type="none">
              {seenComments.length > 0? seenComments.map(comment => (
                    <li className="ingredientList" key={Math.random()}>
                      <Link to={`/cb/${this.props.user}/${comment.recipe_id}`}>💬 you have a new message from {comment.username} for your {comment.recipe_name}</Link>
                    </li>
                  ))
                  : ""}
                  {seenFavorites.length > 0? seenFavorites.map(favorites => (
                    <li className="ingredientList" key={Math.random()}>
                      {favorites.username} ❤️ your {favorites.recipe_name}
                    </li>
                  ))
                :""}
                {seenFollowers.length > 0? seenFollowers.map(follower => (
                  <li className="ingredientList" key={Math.random()}>
                    {follower.username} started following you 👣!
                  </li>
                ))
              :""}
                {(seenComments.length === 0 && seenFavorites.length === 0 && seenFollowers.length === 0)? "There no any notifications": ""}
            </ul>
          <button className="xButton" onClick={this.closeModal}>x</button>
          </Modal>
        </div>
      </div>
    );
  }
}

export default Notifications;
