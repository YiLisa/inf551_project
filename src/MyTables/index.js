import React, { Component } from "react";
import { Table, Button, Empty, Alert } from "antd";
import { navigate_endpoint } from "../constants";
import axios from "axios";

class MyTables extends Component {
  state = {
    table_data: this.props.input_data,
    table_name_list: this.props.table_names,
    db_name: this.props.db_name,
    f_key_dict: this.props.foreign_keys,
  };

  renderTables = (table_name) => {
    console.log(this.state.table_data);
    if (table_name in this.state.table_data) {
      var raw_data = this.state.table_data[table_name];
      var columns = [];

      // columns
      for (let col_name in raw_data[0]) {
        var temp_dict = {};
        temp_dict["title"] = col_name;
        temp_dict["dataIndex"] = col_name.toLowerCase();
        temp_dict["key"] = col_name.toLowerCase();

        if (this.state.f_key_dict[table_name].includes(col_name)) {
          temp_dict["render"] = (clicked_key) => (
            <Button
              type="link"
              onClick={() =>
                this.navigate(
                  this.state.db_name,
                  table_name,
                  col_name,
                  clicked_key
                )
              }
            >
              {clicked_key}
            </Button>
          );
        }
        columns.push(temp_dict);
      }

      // data
      var i = 1;
      var data = [];
      for (let row of raw_data) {
        var temp_data_dict = {};
        temp_data_dict["key"] = i++;
        for (let key in row) {
          temp_data_dict[key.toLowerCase()] = row[key];
        }
        data.push(temp_data_dict);
      }

      return (
        <div>
          <h4>{table_name}</h4>
          <Table columns={columns} dataSource={data} />
        </div>
      );
    }
  };

  navigate = async (db_name, table_name, col_name, clicked_key) => {
    var params_str =
      navigate_endpoint +
      "db_name=" +
      db_name +
      "&table_name=" +
      table_name +
      "&col_name=" +
      col_name +
      "&clicked_key=" +
      clicked_key;
    const search_response = await axios.get(params_str);
    this.state.table_data = search_response.data;
    this.setState({ table_data: search_response.data });
  };

  render() {
    var total_num = 0;
    for (let key in this.state.table_data) {
      total_num = total_num + this.state.table_data[key].length;
    }

    var content = null;
    if (JSON.stringify(this.state.table_data) == "{}") {
      content = (
        <div>
          <br />
          <br />
          <Empty description="No Data!" />
        </div>
      );
    } else {
      content = (
        <div>
          {this.state.table_name_list.map((table_name) =>
            this.renderTables(table_name)
          )}
        </div>
      );
    }

    return (
      <div>
        {content}
        <Alert
          message={total_num + " data retrieved from server!"}
          type="success"
          banner={true}
        />
      </div>
    );
  }
}

export default MyTables;
