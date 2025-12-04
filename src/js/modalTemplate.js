/**
 * Modal Template Module
 * Contains HTML template for login modal dialog
 */

/**
 * Login modal HTML template
 * @type {string}
 */
export const modalTemplate = (
  `<div class='modal' id='login-modal'>
    <div class='modal__overlay'></div>
    <div class='modal__content'>
      <form class='login-form' id='login-form'>
        <div class='form-group'>
          <label for='email' class='form-label'>
            Email address <span class='required'>*</span>
          </label>
          <input
            type='email'
            id='email'
            name='email'
            class='form-input'
            placeholder='Enter your email'
            autocomplete='email'
            required
          />
          <span class='form-error' id='email-error'></span>
        </div>
        <div class='form-group'>
          <label for='password' class='form-label'>
            Password <span class='required'>*</span>
          </label>
          <div class='password-wrapper'>
            <input
              type='password'
              id='password'
              name='password'
              class='form-input'
              placeholder='Enter your password'
              autocomplete='current-password'
              required
            />
            <button
              type='button'
              class='password-toggle'
              aria-label='Toggle password visibility'
            >
              <img class='eye-icon' src='' alt='Toggle password' />
            </button>
          </div>
          <span class='form-error' id='password-error'></span>
        </div>
        <div class='form-footer'>
          <label class='checkbox-label'>
            <input
              type='checkbox'
              id='remember-me'
              name='remember-me'
              class='checkbox-input'
            />
            <span class='checkbox-text'>Remember me</span>
          </label>
          <a href='#' class='forgot-password'>
            Forgot Your Password?
          </a>
        </div>
        <button type='submit' class='btn btn--primary btn--form'>
          LOG IN
        </button>
      </form>
    </div>
  </div>`
);
