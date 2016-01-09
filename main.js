class App extends React.Component {
    constructor() {
        super();
        this.state = {
            myCredits: [],
            guysCredits: [],
            totalGuysCredit: null,
            alert: false
        };
    }

    componentDidMount() {
        let ls = localStorage;
        let guysCredits = JSON.parse(ls.getItem("list"));
        console.log(guysCredits);

        if (!guysCredits || guysCredits.length === 0) {
            let arr = [];
            ls.setItem("list", JSON.stringify(arr));
        } else if (guysCredits) {
            this.setState({guysCredits}, () => {
                console.log('did mount state: ', this.state.guysCredits);
            });
        }
    }

    handleOnFocusInput(e) {
        this.setState({alert: false});
    }

    handleAddCredit(e) {
        e.preventDefault();

        let ls = localStorage;
        let list = JSON.parse(ls.getItem("list"));

        let name = this.refs.name.value;
        let description = this.refs.description.value;
        let credit = this.refs.credit.value;

        let numberExpr = /^[0-9]*$/g;

        if (((credit.toString())).match(numberExpr)) {
            let userObject = _.find(list, function(n) {
                 return n.name === name;
            });

            if (userObject !== undefined) {
                let userDebsArray = userObject.debs;
                userDebsArray.push(credit);
            } else {
                let el = {
                    name,
                    debs: []
                };

                el.debs.push([{credit, description}]);
                console.log(list);
                list.push(el);
                console.log(list);
                ls.setItem("list", JSON.stringify(list));

                this.refs.name.value = null;
                this.refs.description.value = null;
                this.refs.credit.value = null;
            }
        }
    }

    handleDelete(user) {
        let ls = localStorage;
        let list = this.state.guysCredits;

        let filteredList = _.filter(list, (n) => {
            return n.name !== user.name;
        });

        this.setState({guysCredits: filteredList});
        ls.setItem("list", JSON.stringify(filteredList));
    }

    render() {
        let ls = localStorage;
        let lsList = JSON.parse(ls.getItem("list"));

        let guysList = _.map(lsList, (n, index) => {
            return <li className="clearfix" key={index}>
                      <div className="list__item">
                          <div className="row">
                             <div className="col-xs-6">
                                {n.name}
                             </div>

                             <div className="col-xs-6 text-right">
                                <i className="list__icon blue glyphicon glyphicon-pencil"></i>
                                <i onClick={this.handleDelete.bind(this, n)} className="list__icon red glyphicon glyphicon-remove"></i>
                              </div>
                          </div>
                          <div className="row">
                             <div className="col-xs-12">
                                {n.debs}
                             </div>
                          </div>
                      </div>
                   </li>;
        });

        // let list = (this.state.guysCredits.length !== 0) ? '' : "Please, add new debt :)";
        // let alert = this.state.alert ? <div className="alert alert-danger" role="alert">Please, enter number in dollar input</div> : "";

        return (
            <div className="container">
                <div className="row">
                    <h2 className="text-center">Lolik</h2>
                    <div className="col-xs-6 col-xs-offset-3">
                        <form onSubmit={this.handleAddCredit.bind(this)}>

                            <div className="row">
                                <div className="col-xs-8 col-xs-offset-2">
                                    <div className="input-group form-group">
                                      <span className="input-group-addon">
                                        <i className="glyphicon glyphicon-user" />
                                      </span>
                                      <input
                                            ref="name"
                                            onFocus={this.handleOnFocusInput.bind(this)}
                                            className="form-control form-group"
                                            placeholder="Name"
                                            required
                                      />
                                    </div>

                                    <div className="input-group form-group">
                                      <span className="input-group-addon">
                                        <i className="glyphicon glyphicon-pencil" />
                                      </span>
                                      <input
                                            ref="description"
                                            onFocus={this.handleOnFocusInput.bind(this)}
                                            className="form-control"
                                            placeholder="Description(optional)"
                                      />
                                    </div>

                                    <div className="input-group form-group">
                                      <span className="input-group-addon">
                                        <i className="glyphicon glyphicon-usd" />
                                      </span>
                                      <input
                                          ref="credit"
                                          onFocus={this.handleOnFocusInput.bind(this)}
                                          className="form-control"
                                          placeholder="Debt"
                                          required
                                      />
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-xs-8 col-xs-offset-2">
                                    <button type="submit" className="btn btn-primary center-block">Add new debt</button>
                                </div>
                            </div>
                        </form>

                        <div className="row">
                            <div className="col-xs-8 col-xs-offset-2">
                                <h3>Debtors</h3>

                                <ul className="list list-unstyled">
                                    {guysList}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

ReactDOM.render(
    <App />,
    document.getElementById("app")
);