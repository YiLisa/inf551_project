import React, { Component } from "react";
import DBSelection from "../DBSelection/index";
import { Space, Input, Spin } from "antd";
import Mytables from "../MyTables/index";
import { search_endpoint } from "../constants";
import axios from "axios";

const { Search } = Input;

class Home extends Component {
  state = {
    database: null,
    table_data: null,
    f_key_dict: null,
    table_names: null,
    total_data_num: null,
    loading: false,
  };

  getDBValue = (data) => {
    this.state.database = data;
    this.setState({ database: data });
  };

  onSearch = async (value) => {
    const keywords = value.split(" ");
    var params_str = search_endpoint + "db_name=" + this.state.database;
    for (let i = 0; i < keywords.length; i++) {
      params_str = params_str + "&keyword=" + keywords[i];
    }
    const search_response = await axios.get(params_str);
    const search_results = search_response.data.data;
    this.state.f_key_dict = search_response.data.foreignkeys;
    this.state.table_data = search_results;
    this.state.table_names = search_response.data.table_names;

    // 解决search不更新问题
    this.setState((prevState) => {
      delete prevState.table_data;
      return prevState;
    });

    this.setState({
      table_data: search_results,
      f_key_dict: search_response.data.foreignkeys,
    });
  };

  renderTable = () => {
    if (this.state.table_data != null) {
      return (
        <Mytables
          input_data={this.state.table_data}
          foreign_keys={this.state.f_key_dict}
          db_name={this.state.database}
          table_names={this.state.table_names}
        />
      );
    }
  };

  render() {
    return (
      <div>
        <br />
        <br />
        <DBSelection getChildValue={this.getDBValue} />
        <br />
        <div>
          <h3>Type in keywords</h3>
          <Space>
            <Search
              placeholder="input search text"
              enterButton="Search"
              size="large"
              onSearch={this.onSearch}
            />
          </Space>
          <br />
          <br />
          {this.renderTable()}
        </div>
      </div>
    );
  }
}

export default Home;
