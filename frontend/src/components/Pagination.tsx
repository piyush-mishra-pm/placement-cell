import React, {Dispatch, SetStateAction} from 'react';

function Pagination({
  page,
  pages,
  changePage,
}: {
  page: number;
  pages: number;
  changePage: Dispatch<SetStateAction<number>>;
}) {
  return (
    <div className="ui centered container">
      <div className="ui buttons">
        <button
          className="ui labeled icon button active"
          onClick={() => changePage((page) => page - 1)}
          disabled={page === 1}
        >
          <i className="left chevron icon"></i>
          Back
        </button>
        <button className="ui info label">
          Showing Page {page}/{pages}.
        </button>
        <button
          className="ui right labeled icon button"
          onClick={() => changePage((page) => page + 1)}
          disabled={page === pages}
        >
          Forward
          <i className="right chevron icon"></i>
        </button>
      </div>
    </div>
  );
}

export default Pagination;
