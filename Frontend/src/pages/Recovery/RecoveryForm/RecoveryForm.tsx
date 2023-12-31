import { fields } from ".";
import { reduxForm } from "redux-form";
import Button from "components/atoms/Button";
import ReduxFormFields from "components/molecules/ReduxFormFields";
function RecoveryForm({ handleSubmit }: any) {
  return (
    <form onSubmit={handleSubmit} noValidate>
      <div
        style={{
          overflowY: "auto",
          paddingRight: "5px",
        }}
      >
        <ReduxFormFields fields={fields} />
        <Button
          variant="text"
          type="submit"
          disableElevation
          style={{
            minWidth: "auto",
            marginTop: "16px",
            paddingLeft: 0,
            borderColor: "#ffffff",
          }}
        >
          <span style={{
              userSelect: 'text',
              overflow: 'hidden',
            }}>Recover</span>
        </Button>
      </div>
    </form>
  );
}
export default reduxForm({ form: "RecoveryForm" })(RecoveryForm);
