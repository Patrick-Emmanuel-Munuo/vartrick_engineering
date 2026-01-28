import React from 'react';
import { Link } from 'react-router-dom';
export default function TableFooter(props) {
  if(props.config.show_info===true || props.config.show_pagination===true){
    return (
      <div className="row table-foot table-foot" id={(props.id) ? props.id + "table-foot" : ""}>
        <div className="col-md-6">
          {(props.config.show_info) ? props.paginationInfo : null}
        </div>
        <div className="col-md-6 pull-right text-right">
          {(props.config.show_pagination) ? (
            <nav aria-label="Page navigation" className="pull-right">
              <ul className="pagination justify-content-end pagination">
                <Pagination
                  language={props.config.language}
                  isFirst={props.isFirst}
                  isLast={props.isLast}
                  pages={props.pages}
                  page_number={props.page_number}
                  previousPage={props.previousPage}
                  nextPage={props.nextPage}
                  goToPage={props.goToPage}/>
              </ul>
            </nav>
          ) : null}
        </div>
      </div>
    );
  } else {
    return null;
  }
}

function Pagination(props) {
  let size = props.pages;
  let page = props.page_number;
  let step = 2;
  let tags = [];
  let { language: { pagination } } = props;
  let Item = function (props) {
    let className = props.className || "";
    return (
      <li className={"page-item " + className}>
        <Link
          to="#"
          className="page-link"
          onClick={(e) => {
            e.preventDefault();
            if (typeof props.onClick === 'function') {
              props.onClick(e);
            }
          }}
        >
          {props.children}
        </Link>
      </li>
    );
  };

  let Add = function (s, f) {
    for (let i = s; i < f; i++) {
      tags.push(
        <Item
          key={i}
          className={page === i ? "active" : ""}
          onClick={(e) => props.goToPage(e, i)}
        >
          {i}
        </Item>
      );
    }
  };

  let Last = function () {
    tags.push(<Item key="l..." disabled>…</Item>);
    tags.push(
      <Item
        key={size}
        className={page === size ? "active" : ""}
        onClick={(e) => props.goToPage(e, size)}
      >
        {size}
      </Item>
    );
  };

  let First = function () {
    tags.push(
      <Item
        key="1"
        className={page === 1 ? "active" : ""}
        onClick={(e) => props.goToPage(e, 1)}
      >
        1
      </Item>
    );
    tags.push(<Item key="f..." disabled>…</Item>);
  };

  tags.push(
    <Item
      key="p0"
      className={props.isFirst ? "disabled" : ""}
      onClick={props.previousPage}
    >
      {pagination.previous ? pagination.previous : <span>&#9668;</span>}
    </Item>
  );

  if (size < step * 2 + 6) {
    Add(1, size + 1);
  } else if (page < step * 2 + 1) {
    Add(1, step * 2 + 4);
    Last();
  } else if (page > size - step * 2) {
    First();
    Add(size - step * 2 - 2, size + 1);
  } else {
    First();
    Add(page - step, page + step + 1);
    Last();
  }

  tags.push(
    <Item
      key="n0"
      className={props.isLast ? "disabled" : ""}
      onClick={props.nextPage}
    >
      {pagination.next ? pagination.next : <span>&#9658;</span>}
    </Item>
  );

  return tags;
}
