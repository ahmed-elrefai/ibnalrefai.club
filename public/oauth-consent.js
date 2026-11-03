const status = document.getElementById('status');
const loginPanel = document.getElementById('login-panel');
const approvalPanel = document.getElementById('approval-panel');
const loginForm = document.getElementById('login-form');
const approveButton = document.getElementById('approve-button');
const denyButton = document.getElementById('deny-button');
const signOutButton = document.getElementById('sign-out-button');
const clientDetails = document.getElementById('client-details');
const signedInUser = document.getElementById('signed-in-user');
const warning = document.getElementById('authorization-warning');
const authorizationId = new URLSearchParams(window.location.search).get('authorization_id');

let supabase;

function showError(message) {
    status.textContent = message;
    status.hidden = false;
}

function redirectToOAuthClient(url) {
    const target = new URL(url);
    const isHttps = target.protocol === 'https:';
    const isLoopbackHttp = target.protocol === 'http:'
        && ['localhost', '127.0.0.1', '[::1]'].includes(target.hostname);
    if (!isHttps && !isLoopbackHttp) {
        throw new Error('Supabase returned an unsupported OAuth client redirect.');
    }
    window.location.assign(target.href);
}

async function loadAuthorization() {
    const configResponse = await fetch('/oauth/config', { credentials: 'same-origin' });
    if (!configResponse.ok) throw new Error('OAuth is not configured on this server.');
    const config = await configResponse.json();
    if (!config.owner_user_id) {
        throw new Error('The blog owner account has not been configured.');
    }

    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2.118.0');
    supabase = createClient(config.project_url, config.anon_key, {
        auth: {
            flowType: 'pkce',
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true
        }
    });

    if (!authorizationId) {
        throw new Error('Missing authorization_id in the Supabase callback URL.');
    }

    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;
    const session = sessionData.session;
    if (!session) {
        loginPanel.hidden = false;
        status.hidden = true;
        return;
    }

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (userData.user.id !== config.owner_user_id) {
        warning.textContent = 'This signed-in account is not the configured blog owner. Sign out and use the owner account.';
        warning.hidden = false;
        signedInUser.textContent = userData.user.email || userData.user.id;
        approvalPanel.hidden = false;
        approveButton.disabled = true;
        clientDetails.textContent = 'Approval is disabled for this account.';
        status.hidden = true;
        return;
    }

    const { data: details, error: detailsError } =
        await supabase.auth.oauth.getAuthorizationDetails(authorizationId);
    if (detailsError) throw detailsError;
    if (details.redirect_url) {
        redirectToOAuthClient(details.redirect_url);
        return;
    }
    const clientId = details.client?.id || details.client_id;
    const isAllowedClient = Boolean(
        clientId && config.allowed_oauth_client_ids.includes(clientId)
    );
    signedInUser.textContent = `Signed in as ${userData.user.email || userData.user.id}`;
    clientDetails.textContent = JSON.stringify(details, null, 2);
    if (!isAllowedClient) {
        warning.textContent = 'This OAuth client is not on the server allowlist. Approval is disabled.';
        warning.hidden = false;
        approveButton.disabled = true;
    }
    approvalPanel.hidden = false;
    loginPanel.hidden = true;
    status.hidden = true;
}

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const submit = loginForm.querySelector('button[type="submit"]');
    submit.disabled = true;
    status.hidden = false;
    status.textContent = 'Sending sign-in link…';
    try {
        const { error } = await supabase.auth.signInWithOtp({
            email: new FormData(loginForm).get('email'),
            options: {
                emailRedirectTo: window.location.href,
                shouldCreateUser: false
            }
        });
        if (error) throw error;
        status.textContent = 'Check your email and open the sign-in link on this device to continue.';
    } catch (error) {
        showError(error.message || 'Could not send the sign-in link.');
        submit.disabled = false;
    }
});

approveButton.addEventListener('click', async () => {
    approveButton.disabled = true;
    denyButton.disabled = true;
    status.hidden = false;
    status.textContent = 'Approving access…';
    try {
        const { data, error } = await supabase.auth.oauth.approveAuthorization(
            authorizationId,
            { skipBrowserRedirect: true }
        );
        if (error) throw error;
        if (data?.redirect_url) {
            redirectToOAuthClient(data.redirect_url);
        } else {
            status.textContent = 'Access approved. You can close this window.';
        }
    } catch (error) {
        showError(error.message || 'Could not approve this authorization.');
        approveButton.disabled = false;
        denyButton.disabled = false;
    }
});

denyButton.addEventListener('click', async () => {
    approveButton.disabled = true;
    denyButton.disabled = true;
    status.hidden = false;
    status.textContent = 'Denying access…';
    try {
        const { data, error } = await supabase.auth.oauth.denyAuthorization(
            authorizationId,
            { skipBrowserRedirect: true }
        );
        if (error) throw error;
        if (data?.redirect_url) {
            redirectToOAuthClient(data.redirect_url);
        } else {
            status.textContent = 'Access denied. You can close this window.';
        }
    } catch (error) {
        showError(error.message || 'Could not deny this authorization.');
        approveButton.disabled = false;
        denyButton.disabled = false;
    }
});

signOutButton.addEventListener('click', async () => {
    await supabase.auth.signOut();
    window.location.reload();
});

loadAuthorization().catch((error) => {
    showError(error.message || 'Could not load the authorization request.');
});
