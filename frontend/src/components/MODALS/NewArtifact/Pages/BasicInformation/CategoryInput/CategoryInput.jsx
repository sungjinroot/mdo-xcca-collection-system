import './CategoryInput.css';

function CategoryInput(props){

    return (
        <label className="stepper-artifact-category-fields">
            <input type="checkbox" name="categories" />
            <span>First</span>
        </label>
    )
}

export default CategoryInput;