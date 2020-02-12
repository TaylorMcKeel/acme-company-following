const { Component } = React;
const { render } = ReactDOM;
const API = 'https://acme-users-api-rev.herokuapp.com/api'



const fetchUser = async ()=> {
  const storage = window.localStorage;
  const userId = storage.getItem('userId'); 
  if(userId){
    try {
      return (await axios.get(`${API}/users/detail/${userId}`)).data;
    }
    catch(ex){
      storage.removeItem('userId');
      return fetchUser();
    }
  }
  const user = (await axios.get(`${API}/users/random`)).data;
  storage.setItem('userId', user.id);
  return  user;
};

const CompForm = ({compFollowed, myNumber, companies}) => {
  const ratings = [1,2,3,4,5]
//need to update so that all companies are listed but the followed ones have a class and change color
  const processed = compFollowed.map( company => {
    return {
      ...company,
      name: companies.filter( comp => company.companyId === comp.id)
      .map( compfilt => {
        return compfilt.name ;
      })
    }})

    
  return processed.map(comp => { return(
    <div>
      <form>
        <p>{comp.name[0]}</p>
        <select value ={comp.rating} onChange={(ev)=>{ontimeupdate({myNumber: ev.target.value})}}>
          {
            ratings.map(num => <option key={num}> {num} </option>)
          }
        </select>
      </form>
    </div>
  )})
}


class App extends Component {
  constructor() {
    super();
    this.state = {
      companies: [],
      user: {},
      compFollowed: [],
      myNumber: 3
    };
    this.onUpdate= this.onUpdate.bind(this)
  }
  
  async componentDidMount() {
    const user = await fetchUser()
    const companies = (await axios.get(`${API}/companies`)).data
    const compFollowed = (await axios.get(`${API}/users/${user.id}/followingCompanies`)).data
      this.setState({companies, compFollowed, user})
  }

  onUpdate(change){
    this.setState(change)
  }
  render() {
    const {companies, compFollowed, user, myNumber} = this.state
    const {onUpdate} = this

    return (
    <div>
      <h2>You ({user.fullName}) are following {compFollowed.length} companies</h2>
      <CompForm myNumber = {myNumber} compFollowed = {compFollowed} onUpdate={onUpdate} companies = {companies}/>
    
    </div>
    )
  }
}
  const root = document.querySelector("#root");
  render(<App />, root);


  //look into 'curl'