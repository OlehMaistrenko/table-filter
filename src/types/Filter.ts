type Filter =
  | {
      type: "select";
      values: string[];
      initialValue: string;
      label: string;
      name: string;
    }
  | {
      type: "text";
      label: string;
      name: string;
      initialValue: string;
    };
export default Filter;
