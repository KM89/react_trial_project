import React, {Component} from 'react';

class Panel extends Component {
	constructor(props) {
		super(props);

		this.state = {
			username: '',
			repositories: [],
			users: []
		}
	}

	_searchAutocomplete(e) {
		e.preventDefault();
		const input = this._username.value;
		const charCount = input.length;
		const url = `https://api.github.com/search/users?q=${input}&access_token=829478cf94bcec0747a7c5d9247415a36605dbfb`;

		if(charCount > 2) {
			let timeout = setTimeout(() =>
				fetch(url)
				.then(response => response.json())
				.then(data => (
					data.items.map(user => user.login)
				))
				.then(logins => this.setState({
					users: logins
				}))
				.catch((error) => console.log(error)),
			1000);
		}
	}

	_fetchRepos(e) {
		e.preventDefault();
		const input = this._username.value;
		const url = `https://api.github.com/users/${input}/repos`;

		fetch(url)
		.then(response => response.json())
		.then(data => (
			{
				username: data[0].owner.login,
				repoList: data.map(repo => repo.name)
			} 
		))
		.then(repos => this.setState({
			username: repos.username,
			repositories: repos.repoList
		}))
		.catch((error) => console.log(error));
	}

	render() {
		const {repositories, username, users} = this.state;

		return (
			<div>
				<div className="row">
					<div className="col-md-12">
						<div className="panel panel-default">
							<div className="panel-body">
								<form onSubmit={e => this._fetchRepos(e)}>
									<div className="form-group">
										<input 	id="usernameInput" 
												className="form-control" 
												type="text" 
												name="username" 
												placeholder="Username" 
												list="usersList"
												onKeyUp={e => this._searchAutocomplete(e)}
												ref={(input) => this._username = input} />
										{
											users.length > 0 ?
												<datalist id="usersList">
												{
													users.map((user, index) => {
													return <option key={index}>
															{user}
														</option>
													})
												}
												</datalist>
											:null
										}
									</div>
									<div className="form-group">
										<button id="submitButton" 
												type="submit" 
												className="btn btn-block">
											Search
										</button>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
				{
					repositories.length > 0 ? 
						<div className="row">
							<div className="col-md-12">
								<div className="table-responsive">
									<table className="table">
										<thead>
											<tr>
												<th>
													<a 	href={`https://github.com/${username}`}
														target="_blank">
														{username}
													</a>
												</th>
											</tr>
										</thead>
										<tbody>
										{
											repositories.map((repo, index) => {
												return <tr key={index}>
													<td>
														<a 	href={`https://github.com/${username}/${repo}`}
															target="_blank">
															{repo}
														</a>
													</td>
												</tr>			
											})
										}
										</tbody>
									</table>
								</div>
							</div>
						</div> 
					:null					
				}
			</div>
		);
	}
}

class Table extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			repositories: [],

			message: ''
		}
	}

	addRepo(e) {
		e.preventDefault();
		const input = this.addInput.value;
		const isOnTheList = this.state.repositories.includes(input); //includes() 

		if (isOnTheList) {
			this.setState({
				message: 'This item is already on the list.'
			})

		} else {
			input !== '' && this.setState({
				repositories: [...this.state.repositories, input],
				message: ''
			})
		}

		this.addForm.reset(); //kasuje input po submicie
	}

	removeItem(item) {

		const newRepositories = this.state.repositories.filter(repo => repo !== item);

		this.setState({ 
			repositories: [...newRepositories] //spread potrzebny czemus
		})
	}

	clearList() {
		this.setState({
			repositories: []
		})
	}

	componentDidMount() {
		this._fetchData();
	}

	_fetchData() {
		const url = 'https://api.github.com/users/userswlwork/repos';

		fetch(url)
		.then(response => response.json())
		.then(parsedJSON => parsedJSON.map(repo => ( //potrzebne nawiasy
			{
				name: repo.name,
			}
		)))
		.then(repos => this.setState({
			repositories: repos
		}))
		.catch((error) => console.log(error));
	}

	render() {
		const {repositories, message} = this.state; // naleza do state (this.state.message)
		const {title} = this.props; //nalezy do props
		return (
			<div>
				{message !== '' && <p className='text-danger'>{message}</p>}
				<div className="table-responsive">
					<table className="table">
						<thead>
							<tr>
								<th>TABLE {title}</th>
							</tr>
						</thead>
						<tbody>	
							{repositories.map((repository, index) =>
								<tr key={index}> 
									<td >
										{repository.name}
										<button onClick={gowno => this.removeItem(repository)}>  {/* usuwa razem z batonem, w state mniej itemow, dlatego mapuje mniej itemow */}
											Remove item
										</button>
									</td>
								</tr>
							)}
						</tbody>
						<tfoot>
							<tr>
								<td>
									<button onClick={gowno => this.clearList()}>
										Clear list
									</button>
								</td>
							</tr>
						</tfoot>
					</table>
				</div>
				<form ref={input => this.addForm = input} onSubmit={e => this.addRepo(e)}>
					<input ref={input => this.addInput = input}/>
					<button type="submit">
						Submit
					</button>
				</form>
			</div>
		);
	}
}

export {Panel, Table}

