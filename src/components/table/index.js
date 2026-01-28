import React, { Component } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import ReactDOMServer from 'react-dom/server';
import _ from 'lodash';
import TableHeader from './components/Header';
import TableFooter from './components/Footer';


class ReactDatatable extends Component {
  constructor(props) {
    super(props);
    this.exportExcelRef = React.createRef();
    this.sortColumn = this.sortColumn.bind(this);
    this.numPages = this.numPages.bind(this);
    this.exportToExcel = this.exportToExcel.bind(this);
    this.exportToPDF = this.exportToPDF.bind(this);
    this.onChange = this.onChange.bind(this);
    this.filterRecords = this.filterRecords.bind(this);
    this.filterData = this.filterData.bind(this);
    this.sortRecords = this.sortRecords.bind(this);
    this.config = {
      button: {
        excel: (props.config && props.config.button && props.config.button.excel) ? props.config.button.excel : false,
        print: (props.config && props.config.button && props.config.button.print) ? props.config.button.print : false,
      },
      filename: (props.config && props.config.filename) ? props.config.filename : "table",
      key_column: props.config && props.config.key_column ? props.config.key_column : "id",
      language: {
        length_menu: (props.config && props.config.language && props.config.language.length_menu) ? props.config.language.length_menu : "Show _MENU_ records",
        filter: (props.config && props.config.language && props.config.language.filter) ? props.config.language.filter : "Search in records...",
        info: (props.config && props.config.language && props.config.language.info) ? props.config.language.info : "Showing _START_ to _END_ of _TOTAL_ entries",
        pagination: {
          first: (props.config && props.config.language && props.config.language.pagination && props.config.language.pagination.first) ? props.config.language.pagination.first : "First",
          previous: (props.config && props.config.language && props.config.language.pagination && props.config.language.pagination.previous) ? props.config.language.pagination.previous : "Previous",
          next: (props.config && props.config.language && props.config.language.pagination && props.config.language.pagination.next) ? props.config.language.pagination.next : "Next",
          last: (props.config && props.config.language && props.config.language.pagination && props.config.language.pagination.last) ? props.config.language.pagination.last : "Last"
        },
        no_data_text: (props.config && props.config.language && props.config.language.no_data_text) ? props.config.language.no_data_text : 'No rows found',
        loading_text: (props.config && props.config.language && props.config.language.loading_text) ? props.config.language.loading_text : "Loading..."
      },
      length_menu: (props.config && props.config.length_menu) ? props.config.length_menu : [10, 25, 30, 50, 75, 100],
      show_length_menu: (props.config.show_length_menu !== undefined) ? props.config.show_length_menu : true,
      show_filter: (props.config.show_filter !== undefined) ? props.config.show_filter : true,
      show_pagination: (props.config.show_pagination !== undefined) ? props.config.show_pagination : true,
      show_info: (props.config.show_info !== undefined) ? props.config.show_info : true,
      show_first: (props.config.show_first !== undefined) ? props.config.show_first : true,
      show_last: (props.config.show_last !== undefined) ? props.config.show_last : true,
      pagination: (props.config.pagination) ? props.config.pagination : 'basic'
    };
    this.state = {
      is_temp_page: false,
      filter_value: "",
      page_size: (props.config.page_size) ? props.config.page_size : 10,
      page_number: 1,
      sort: (props.config && props.config.sort) ? props.config.sort : false
    };
  }
  onChange =() => {
    let tableData = {
      filter_value: this.state.filter_value,
      page_number: this.state.page_number,
      page_size: this.state.page_size,
      sort_order: this.state.sort
    };
    this.props.onChange(tableData);
  }
  filterData = (records) => {
  const { filter_value } = this.state;
  if (!filter_value) return records;
  return records.filter((record) => {
    let allow = false;
    this.props.columns.forEach((column) => {
      if (record.hasOwnProperty(column.key)) {
        const cellValue = record[column.key];
        if (cellValue !== null && cellValue !== undefined) {
          const cellStr = cellValue.toString().toLowerCase();
          const filterStr = filter_value.toString().toLowerCase();
          if (cellStr.includes(filterStr)) {
            allow = true;
          }
        }
      }
    });
    return allow;
  });
  };
  filterRecords = (e) => {
   const value = e.target.value ? e.target.value.trim() : '';

   this.setState({ page_number: 1, filter_value: value }, this.onChange);
  }
  changePageSize = (e) => {
    this.setState({ page_size: e.target.value }, this.onChange);
  }
  sortColumn = (event, column, sortOrder) => {
    if (!column.sortable) return false;
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    this.setState({ sort: { column: column.key, order: newSortOrder } }, this.onChange);
  }
  paginate = (records) => {
    const { page_size, page_number } = this.state;
    return records.slice((page_number - 1) * page_size, page_number * page_size);
  }
  numPages = (totalRecords) => {
    return Math.ceil(totalRecords / this.state.page_size);
  }
  isFirst = () => {
    if (this.state.page_number === 1) {
      return true;
    } else {
      return false;
    }
  }
  isLast= () =>  {
    // because for empty records page_number will still be 1
    if(this.pages === 0){
      return true;
    }
    if (this.state.page_number === this.pages) {
      return true
    } else {
      return false;
    }
  }
  goToPage = (e, pageNumber) => {
    e.preventDefault();
    if(this.state.page_number === pageNumber){
      return;
    }
    let pageState = {
      previous_page: this.state.page_number,
      current_page: pageNumber
    };
    this.setState({
      is_temp_page: false,
      page_number: pageNumber
    }, () => {
      this.props.onPageChange(pageState);
      this.onChange();
    });
  }

  firstPage = (e) => {
    e.preventDefault();
    if (this.isFirst()) return;
    this.goToPage(e, 1);
  }

  lastPage = (e) => {
    e.preventDefault();
    if (this.isLast()) return;
    this.goToPage(e, this.pages);
  }

  previousPage = (e) => {
    e.preventDefault();
    if (this.isFirst()) return;
    this.goToPage(e, this.state.page_number - 1);
  }

  nextPage = (e) => {
    e.preventDefault();
    if (this.isLast()) return;
    this.goToPage(e, this.state.page_number + 1);
  }

  onPageChange = (e, isInputChange = false) => {
    if (isInputChange) {
      this.setState({ is_temp_page: true, temp_page_number: e.target.value });
    } else {
      if (e.key === 'Enter') {
        this.goToPage(e, e.target.value);
      }
    }
  }

  onPageBlur = (e) => {
    this.goToPage(e, e.target.value);
  }

strip(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
}

exportToExcel = () => {
  try {
    // Convert your current records into a 2D array
    //const data = this.props.records|| [];
    //const worksheet = XLSX.utils.json_to_sheet(data)

    // Convert your current records into a 2D array
    const header = this.props.columns.map(col => col.text);
    const data = this.props.records.map(record =>
      this.props.columns.map(col =>
        typeof col.cell === 'function'
          ? this.strip(ReactDOMServer.renderToStaticMarkup(col.cell(record)))
          : record[col.key] || ''
      )
    );
    const worksheet = XLSX.utils.aoa_to_sheet([header, ...data]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    // Get current date string YYYY-MM-DD
    const date = new Date();
    const dateString = date.toISOString().slice(0, 16)+' report'; // e.g. "2025-05-16"
    const filename = `${this.props.config?.filename || dateString}.xlsx`;
    const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(dataBlob, filename);
  } catch (error) {
    if (error instanceof Error) {
      console.log("Error in exportToExcel function:", error.message);
    } else {
      console.error(error);
    }
  }
};


  exportToPDF = () => {
    try{
      window.print()
    } catch (error) {
        if (error instanceof Error){
          console.log("error exportToPDF function " + error )
          }else{
            console.error(error)
          }
    }
  }
  sortRecords = () => {
    if(this.state.sort){
      return _.orderBy(this.props.records, o => {
        let colVal = o[this.state.sort.column];
        let typeofColVal = typeof colVal;
        
        if (typeofColVal === "string") {
          if (isNaN(colVal)) {
            return colVal.toLowerCase();
          } else {
            return Number(colVal);
          }
        } else if (typeofColVal === "number") {
          return Number(colVal);
        }
      }, [this.state.sort.order]);
    } else {
      return this.props.records;
    }
  }
  render() {
    let filterRecords, totalRecords, pages, isFirst, isLast;
    if(this.props.dynamic === false){
      let records = (this.props.onSort) ? this.props.onSort(this.state.sort.column, this.props.records, this.state.sort.order) : this.sortRecords(),
        filterValue = this.state.filter_value;
        filterRecords = records;

      if (filterValue) {
        filterRecords = this.filterData(records);
      }
      totalRecords = Array.isArray(filterRecords) ? filterRecords.length : 0;
      pages = this.pages = this.numPages(totalRecords);
      isFirst = this.isFirst();
      isLast = this.isLast();
      filterRecords = Array.isArray(filterRecords) ? this.paginate(filterRecords) : [];
    }else{
      filterRecords = this.props.records;
      totalRecords = this.props.total_record;
      pages = this.pages = this.numPages(totalRecords);
      isFirst = this.isFirst();
      isLast = this.isLast();
    }

    let startRecords = (this.state.page_number * this.state.page_size) - (this.state.page_size - 1);
    let endRecords = this.state.page_size * this.state.page_number;
    endRecords = (endRecords > totalRecords) ? totalRecords : endRecords;
    
    let paginationInfo = this.config.language.info;
    paginationInfo = paginationInfo.replace('_START_', (this.state.page_number === 1) ? 1 : startRecords);
    paginationInfo = paginationInfo.replace('_END_', endRecords);
    paginationInfo = paginationInfo.replace('_TOTAL_', totalRecords);
  
    return (
      <div className="datatable-wrapper">
        {/* Render Table Header */}
        <TableHeader
          config={this.config}
          id={this.props.id}
          recordLength={(this.props.dynamic) ? this.props.total_record : this.props.records.length}
          filterRecords={this.filterRecords.bind(this)}
          changePageSize={this.changePageSize.bind(this)}
          exportToExcel={this.exportToExcel.bind(this)}
          exportToPDF={this.exportToPDF.bind(this)}/>
        {/* Render Table Body */}
          {/* Table Body */}
<div className="" id={this.props.id ? `${this.props.id}-table-body` : ""}>
  <div className="table-responsive mt-3">
    <table className={`table table-striped table-hover table-bordered ${this.props.className}`} id={this.props.id}>
      <thead className={this.props.tHeadClassName || ''}>
        <tr>
          {this.props.columns.map((column) => {
            const isSortable = column.sortable;
            const isSortedColumn = isSortable && this.state.sort.column === column.key;
            const sortOrder = isSortedColumn ? this.state.sort.order : "";
            
            let classText = [
              isSortable ? "sortable" : "",
              sortOrder,
              `center`,
              column.TrOnlyClassName || ""
            ].filter(Boolean).join(" ");

            return (
              <th
                key={column.key || column.text}
                className={classText}
                width={column.width || ""}
                onClick={(e) => this.sortColumn(e, column, sortOrder)}
              >
                {column.text}
                { isSortedColumn && (
                  <span className="ms-1">{sortOrder === "asc" ? "🔼" : "🔽"}</span>
                )}
              </th>
            );
          })}
        </tr>
      </thead>

      <tbody>
        {this.props.loading ? (
          <tr>
            <td colSpan={this.props.columns.length} className="text-center py-3">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">{this.config.language.loading_text}</span>
              </div>
            </td>
          </tr>
        ) : filterRecords.length ? (
          filterRecords.map((record) => {
            const rowIndex = _.indexOf(this.props.records, record);
            return (
              <tr
                key={record[this.config.key_column]}
                onClick={(e) => this.props.onRowClicked(e, record, rowIndex)}
              >
                {this.props.columns.map((column) => {
                  const CellContent =
                    column.cell && typeof column.cell === "function"
                      ? column.cell(record, rowIndex)
                      : record[column.key] || "";
                      // Apply fixed width if provided
                 const style = column.width ? { width: column.width, whiteSpace: "normal" } : { whiteSpace: "normal" };
                  return (
                    <td key={column.key || column.text} 
                        className={column.className}
                        style={style}
                    >
                      {CellContent}
                    </td>
                  );
                })}
              </tr>
            );
          })
        ) : (
          <tr>
            <td colSpan={this.props.columns.length} align="center">
              {this.config.language.no_data_text}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>

        {/* Render Table Pagination */}
        <TableFooter
          config={this.config}
          id={this.props.id}
          isFirst={isFirst}
          isLast={isLast}
          paginationInfo={paginationInfo}
          pages={pages}
          page_number={this.state.page_number}
          is_temp_page={this.state.is_temp_page}
          temp_page_number={this.state.temp_page_number}
          firstPage={this.firstPage.bind(this)}
          lastPage={this.lastPage.bind(this)}
          previousPage={this.previousPage.bind(this)}
          nextPage={this.nextPage.bind(this)}
          goToPage={this.goToPage.bind(this)}
          changePageSize={this.changePageSize.bind(this)}
          onPageChange={this.onPageChange.bind(this)}
          onPageBlur={this.onPageBlur.bind(this)}
        />
      </div>
    );
  }
}
/**
* Define component display name
*/
ReactDatatable.displayName = 'React_datatable';

/**
* Define defaultProps for this component
*/
ReactDatatable.defaultProps = {
  id: "datatable",
  className: "table table-bordered table-striped",
  columns: [],
  config: {
    button: {
      excel: false,
      print: false,
    },
    filename: "table",
    key_column:"id",
    language: {
      length_menu: "Show _MENU_ records",
      filter: "Search in records...",
      info: "Showing _START_ to _END_ of _TOTAL_ entries",
      pagination: {
        first: "First",
        previous: "Previous",
        next: "Next",
        last: "Last"
      }
    },
    length_menu: [10, 20, 30, 50, 75, 100],
    no_data_text: "No rows found",
    page_size: 10,
    sort: {
      column: "created_date",
      order: "desc"
    },
    show_length_menu: true,
    show_filter: true,
    show_pagination: true,
    show_info: true,
    show_first: true,
    show_last: true
  },
  dynamic: false,
  records: [],
  total_record: 0,
  onChange: () => { },
  onPageChange: () => { },
  onRowClicked: () => { }
}
export default ReactDatatable;
