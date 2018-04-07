import React, {Component} from 'react';
import './Landing.css';

var createReactClass = require('create-react-class');


var Landing = createReactClass({
    apiKey: '5f9a2ab08c36a2b6a3f27847719a4b8a',
    getInitialState: function() {
    return {searchTerm:"", searchUrl:""};
    },
    handleKeyUp :function(e){
    if (e.key === 'Enter' && this.state.searchTerm !== '') {
        var searchUrl = "search/multi?query=" + this.state.searchTerm + "&api_key=" + this.apiKey;
        this.setState({searchUrl:searchUrl});
    }
    },

    handleChange : function(e){
        this.setState({searchTerm : e.target.value});    
    },
    render () {
        return(
            <div>
                <header className="Header">
                    <Navigation />
                    <UserButton />
                </header>
                <Banner />
                <TitleList title="Trending now" url='discover/movie?sort_by=popularity.desc&page=1' />
                <TitleList title="Most Popular TV Shows" url='discover/tv?sort_by=popularity.desc&page=1' />
            </div>
        );
    }
})

var Navigation = createReactClass({
    render () {
        return(
            <div id="navigation" className="Navigation">
            <nav>
              <ul>
                <li><a href="/">My list</a></li>
                <li><a href="/landing">Discover</a></li>
              </ul>
            </nav>
          </div>
        );
    }
})

var UserProfile = createReactClass({
    render () {
        return (
            <div className="UserProfile">
            <div className="User">
              <div className="name">Patrick Ruiz</div>
              <div className="image"><img src="https://img00.deviantart.net/86ca/i/2009/191/0/e/naruto_sage_mode_by_kraytos.jpg" alt="profile" /></div>
            </div>
          </div>
        );
    }
})

class UserButton extends Component {
    logout = () => {
        localStorage.removeItem('jwtToken');
        window.location.reload();
    };

    render() {
        return (
            <div className="UserProfile">
            <div className="User">
              <div className="LogoutButton"> 
                    {localStorage.getItem('jwtToken') &&
                            <button class="btn btn-primary" onClick={this.logout}>Logout</button>
                    }
              </div>
            </div>
          </div>
        );
    }
}



var Banner = createReactClass({
    render () {
        return (
            <div id="hero" className="Hero" style={{backgroundImage: 'url(https://fortunedotcom.files.wordpress.com/2016/04/7339ba26a89e632a7bf135b53b2ba46e17d56050ac661dc320040f3a6a8235e7.jpeg)'}}>
            <div className="content">
              <img className="logo" src="https://i.imgur.com/HWGPhT4.png" alt="SV background" />
              <h2>Season 5 now available</h2>
              <p>In the high-tech gold rush of modern Silicon Valley, the people most qualified to succeed are the least capable of handling success. Partially inspired by Mike Judge’s own experiences as a Silicon Valley engineer in the late ‘80s, Silicon Valley is an American sitcom that centers around six programmers who are living together and trying to make it big in the Silicon Valley.</p>
              <div className="button-wrapper">
                <BannerButton primary={false} text="+ My list" />
              </div>
            </div>
            <div className="overlay"></div>
          </div>
        );
    }
})

var BannerButton = createReactClass({
    render () {
        return (
            <a href="#" className="Button" data-primary={this.props.primary}>{this.props.text}</a>
        );
    }
})

var TitleList = createReactClass({
    apiKey: '5f9a2ab08c36a2b6a3f27847719a4b8a',
    getInitialState: function() {
        return {data: [], mounted: false};
      },
    loadContent: function() {
        var requestUrl = 'https://api.themoviedb.org/3/' + this.props.url + '&api_key=' + this.apiKey;
        fetch(requestUrl).then((response)=>{
            return response.json();
        }).then((data)=>{
            this.setState({data : data});
        }).catch((err)=>{
            console.log("There has been an error");
        });
    },
    componentWillReceiveProps : function(nextProps){
        if(nextProps.url !== this.props.url && nextProps.url !== ''){
          this.setState({mounted:true,url:nextProps.url},()=>{
            this.loadContent();
          });
          
        }
    },
    componentDidMount: function() {
        if(this.props.url !== ''){
          this.loadContent();
          this.setState({mounted:true});
        }
        
    },
    render () {
        var titles ='';
        if(this.state.data.results) {
          titles = this.state.data.results.map(function(title, i) {
            if(i < 5) {
              var name = '';
              var backDrop = 'http://image.tmdb.org/t/p/original' + title.backdrop_path;
              if(!title.name) {
                name = title.original_title;
              } else {
                name = title.name;
              }
    
              return (
                <Item key={title.id} title={name} score={title.vote_average} overview={title.overview} backdrop={backDrop} />
              );  
    
            }else{
              return (<div key={title.id}></div>);
            }
          });
        }
        return (
            <div ref="titlecategory" className="TitleList" data-loaded={this.state.mounted}>
              <div className="Title">
                <h1>{this.props.title}</h1>
                <div className="titles-wrapper">
                  {titles}
                </div>
              </div>
            </div>
        ); 
    }
})

var Item = createReactClass({
    render() {
        return (
            <div className="Item" style={{backgroundImage: 'url(' + this.props.backdrop + ')'}} >
            <div className="overlay">
              <div className="title">{this.props.title}</div>
              <div className="rating">{this.props.score} / 10</div>
              <div className="plot">{this.props.overview}</div>
            </div>
          </div>
        );
    }
})

export default Landing