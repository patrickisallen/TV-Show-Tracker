import axios from 'axios';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn,} from 'material-ui/Table';


class Table extends Component {

    constructor(props) {
        super(props);
        this.state = {
            movies: [],
        };
    }

    componentDidMount() {
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
        axios.get('/user')
            .then(res => {
                console.log(res.data);
                this.setState({movies: res.data});
            })
            .catch((error) => {
                if (error.response.status === 401) {
                    this.props.history.push("/login");
                }
            });
    }

    render () {
        return(
            <div class="panel-body">
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHeaderColumn>Title</TableHeaderColumn>
                        <TableHeaderColumn>Rating</TableHeaderColumn>
                        <TableHeaderColumn>Progress</TableHeaderColumn>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {this.state.movies.map(movie =>
                        <TableRow>
                            <TableRowColumn>{movie.title}</TableRowColumn>
                            <TableRowColumn>{movie.rating}</TableRowColumn>
                            <TableRowColumn>{movie.episodes_watched}</TableRowColumn>
                        </TableRow>
                    )}
                    </TableBody>
                </Table>
            </div>
        )
    }
}

export default Table;