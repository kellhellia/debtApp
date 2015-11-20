class App extends React.Component {
    constructor() {
        super();
        this.state = {
            myCredits: [],
            guysCredits: [],
            totalGuysCredit: null
        };
    }

    componentDidMount() {
        let ls = localStorage;

        let arr = [];
        let lsList = JSON.parse(ls.getItem("list"));

        this.setState({guysCredits: lsList});

        if (!lsList) {
            ls.setItem("list", JSON.stringify(arr));
        }

        let sumArr = [];

        _.each(lsList, (n, index) => {
            sumArr.push(+n.credit);
        });

        let totalGuysCredit = _.reduce(sumArr, (total, n) => {
            return total + n;
        });

        this.setState({totalGuysCredit});
        console.log(totalGuysCredit);
        console.log('state', this.state.totalGuysCredit);
    }

    handleAddCredit(e) {
        e.preventDefault();
        let ls = localStorage;

        let list = JSON.parse(ls.getItem("list"));

        let name = this.refs.name.value;
        let credit = this.refs.credit.value;

        let totalGuysCredit = +credit + +this.state.totalGuysCredit;
        console.log(totalGuysCredit);

        this.setState({totalGuysCredit});

        let el = {
            name,
            credit
        }

        list.push(el);

        ls.setItem("list", JSON.stringify(list));
        let guysCredits = this.state.guysCredits;
        guysCredits.push(el);
        this.setState({guysCredits});

        this.refs.credit.value = null;
        this.refs.name.value = null;
    }

    handleDelete(user) {
        let ls = localStorage;
        let list = this.state.guysCredits;

        let filteredList = _.filter(list, (n) => {
            return n.name !== user.name;
        });

        this.setState({guysCredits: filteredList});
        ls.setItem("list", JSON.stringify(filteredList));

        let totalGuysCredit = this.state.totalGuysCredit - user.credit;
        this.setState({totalGuysCredit});
    }

    render() {
        let ls = localStorage;
        let lsList = JSON.parse(ls.getItem("list"));

        let guysList = _.map(this.state.guysCredits, (n, index) => {
            return <li className="clearfix" key={index}>
                      <span className="list__item pull-left">
                        <span className="pull-left">{n.name}</span>
                        <span className="pull-right">
                            {n.credit}
                        </span>
                      </span>

                      <span className="pull-right">
                        <i className="list__icon blue glyphicon glyphicon-pencil"></i>
                        <i onClick={this.handleDelete.bind(this, n)} className="list__icon red glyphicon glyphicon-remove"></i>
                      </span>
                   </li>;
        });

        let list = (this.state.guysCredits.length !== 0) ? '' : "Please, add new debt :)";

        return (
            <div className="container">
                <h2 className="text-center">Total credit: {this.state.totalGuysCredit}</h2>

                <div className="row">
                    <div className="col-xs-6 col-xs-offset-3">
                        <form onSubmit={this.handleAddCredit.bind(this)}>

                            <div className="row">
                                <div className="col-xs-8 col-xs-offset-2">
                                    <div className="input-group form-group">
                                      <span className="input-group-addon">
                                        <i className="glyphicon glyphicon-user" />
                                      </span>
                                      <input ref="name" className="form-control form-group" required />
                                    </div>

                                    <div className="input-group form-group">
                                      <span className="input-group-addon">
                                        <i className="glyphicon glyphicon-usd" />
                                      </span>
                                      <input ref="credit" className="form-control" required />
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
                                    {list}
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