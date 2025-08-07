
const Table = ({ children, className = '', ...props }) => {
  return (
    <div className={`overflow-x-auto ${className}`} {...props}>
      <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
        {children}
      </table>
    </div>
  );
};

const TableHeader = ({ children, className = '', ...props }) => {
  return (
    <thead className={`bg-gray-50 ${className}`} {...props}>
      {children}
    </thead>
  );
};

const TableBody = ({ children, className = '', ...props }) => {
  return (
    <tbody className={className} {...props}>
      {children}
    </tbody>
  );
};

const TableRow = ({ children, className = '', ...props }) => {
  return (
    <tr className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${className}`} {...props}>
      {children}
    </tr>
  );
};

const TableCell = ({ children, className = '', isHeader = false, ...props }) => {
  const Component = isHeader ? 'th' : 'td';
  const baseClasses = isHeader 
    ? 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
    : 'px-6 py-4 text-sm text-gray-900';
  
  return (
    <Component className={`${baseClasses} ${className}`} {...props}>
      {children}
    </Component>
  );
};

Table.Header = TableHeader;
Table.Body = TableBody;
Table.Row = TableRow;
Table.Cell = TableCell;

export default Table;
