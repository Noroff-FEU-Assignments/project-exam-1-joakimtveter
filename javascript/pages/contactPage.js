import { showToast } from '../modules/toast.js';
import { validateMinLength, validateEmail } from '../modules/formValidation.js';
import { everyPageUtils } from '../modules/utils.js';

const contactForm = document.getElementById('contact-form');
const nameField = document.getElementById('name-field');
const emailField = document.getElementById('email-field');
const subjectField = document.getElementById('subject-field');
const messageField = document.getElementById('message-field');
const submitButton = document.getElementById('submit');
const formInputs = [nameField, emailField, subjectField, messageField];

/**
 * Validates the contact form.
 * @param {object} data - Object of form values.
 * @param {string} data.name - Contact form name field.
 * @param {string} data.email - Contact form email field.
 * @param {string} data.subject - Contact form subect field.
 * @param {string} data.message - Contact form message text area.
 * @returns {Object[]} - Array of error objects.
 */
const validateContactForm = (data) => {
    console.log('Validating contact form...', data);
    let errors = [];
    if (validateMinLength(data.name, 5) === false) {
        errors.push({ field: 'name', message: 'Name must be at least 5 caracters long.' });
    }
    if (validateMinLength(data.email, 0) === false) {
        errors.push({ field: 'email', message: 'Email is required.' });
    } else if (validateEmail(data.email) === false) {
        errors.push({ field: 'email', message: 'Email address is not valid.' });
    }
    if (validateMinLength(data.subject, 15) === false) {
        errors.push({ field: 'subject', message: 'Subject must be at least 25 characters long.' });
    }
    if (validateMinLength(data.message, 25) === false) {
        errors.push({ field: 'message', message: 'Message must be at least 25 characters long.' });
    }
    return errors;
};

/**
 * Runs if the form is validated ok. Displays a success message.
 */
// const formSubmissionSuccess = () => {
//     formInputs.forEach((input) => {
//         input.classList.remove('error');
//         input.value = '';
//         document.querySelector(`#${input.id}-error`).innerText = '';
//     });
//     if (document.querySelector('.error-list')) {
//         document.querySelector('.error-list').remove();
//     }
//     showToast('Form submission was successful!', 'success');
// };

/**
 * Runs if the form is not validated ok. Displays an error message.
 * @param {Object[]} errors - Array of error objects.
 */
// const formSubmissionFail = (errorsArr) => {
//     console.error('Failed to submit form! Errors: ', errorsArr);
//     let errors = '';
//     errorsArr.forEach((error) => {
//         errors += `<li>${error.message}</li>`;
//     });
//     let errorFields = [];
//     errorsArr.map((error) => {
//         errorFields.push(error.field);
//     });
//     if (document.querySelector('.error-list')) {
//         document.querySelector('.error-list').remove();
//     }
//     const errorList = document.createElement('ul');
//     errorList.classList.add('error-list');
//     errorList.innerHTML = errors;
//     contactForm.prepend(errorList);
//     formInputs.forEach((input) => {
//         input.classList.remove('error');
//         document.querySelector(`#${input.id}-error`).innerText = '';
//         if (errorFields.includes(input.id)) {
//             input.classList.add('error');
//             const errorMessage = errorsArr.find((error) => {
//                 return error.field === input.id;
//             });
//             document.querySelector(`#${input.id}-error`).innerText = errorMessage.message;
//         }
//     });
//     showToast('Failed to submitt contact form', 'error');
// };

/**
 * Handles the submittion of the contact form.
 * @param {object} event - The event object.
 *
 * @returns void
 */
const handleContactFormSubmit = (event) => {
    event.preventDefault();
    const name = nameField.value.trim() || '';
    const email = emailField.value.trim() || '';
    const subect = subjectField.value.trim() || '';
    const message = messageField.value.trim() || '';
    let errors = [];
    let data = { name, email, subect, message };
    errors = validateContactForm(data);
    // if (errors.length > 0) {
    //     formSubmissionFail(errors);
    // } else {
    //     formSubmissionSuccess();
    // }
};

submitButton.addEventListener('click', (e) => handleContactFormSubmit(e));

everyPageUtils();
