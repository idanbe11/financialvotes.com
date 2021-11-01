import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337';

const parseJSON = (resp) => (resp.json ? resp.json() : resp);

// Checks if a network request came back fine, and throws an error if not
const checkStatus = (resp) => {
  if (resp.status >= 200 && resp.status < 500) {
    return resp;
  }

  return parseJSON(resp).then((resp) => {
    throw resp;
  });
};

const headers = {
  'Content-Type': 'application/json'
};

// UnAuthenticated Requests
async function fetchAPI(url) {
  const res = await fetch(API_URL + url, {
    method: 'GET',
    headers
  })
    .then(checkStatus)
    .then(parseJSON);

  return res;
}

// UnAuthenticated Custom Requests
async function fetchAPIUrl(url) {
  const res = await fetch(url, {
    method: 'GET',
    headers
  })
    .then(checkStatus)
    .then(parseJSON);

  return res;
}

// Authenticated Requests
async function fetchAPIAuth(url, token) {
  const res = await fetch(API_URL + url, {
    method: 'GET',
    headers: {
      ...headers,
      //'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`
    }
  })
    .then(checkStatus)
    .then(parseJSON)
    .catch((err) => console.log('ERR', err));

  return res;
}

// Authenticated Serverless Requests
async function fetchAPIAuthLocal(url, token) {
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      ...headers,
      //'Access-Control-Allow-Origin': '*',
      Authorization: `Bearer ${token}`
    }
  })
    .then((response) => {
      // console.log(response);
      return parseJSON(response);
    })
    .catch((err) => console.log('ERR', err));
  return res;
}

// Authenticated POST Requests
async function postAPI(url, body, token) {
  let res = await axios
    .post(API_URL + url, body, {
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`
      }
    })
    .then(checkStatus)
    .then(parseJSON)
    .catch((err) => {
      if (err.response) {
        return err.response.data.message;
      } else {
        return err.message;
      }
    });
  return res;
}

// Guest POST Requests
async function postAPIGuest(url, body) {
  let res = await axios
    .post(API_URL + url, body, {
      headers: {
        ...headers
      }
    })
    .then(checkStatus)
    .then(parseJSON)
    .catch((err) => {
      if (err.response) {
        return err.response.data.message;
      } else {
        return err.message;
      }
    });
  return res;
}

// Authenticated PUT Requests
async function putAPI(url, body, token) {
  let res = await axios
    .put(API_URL + url, body, {
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`
      }
    })
    .then(checkStatus)
    .then(parseJSON);
  return res;
}

// Authenticated POST Requests with File Uploads
async function postAPIWithFileUpload(url, body, attributeName, file, token) {
  let formData = new FormData();
  formData.append('files', file);
  let res = {};
  await axios({
    method: 'post',
    url: API_URL + '/upload',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`
    }
  })
    .then(async (response) => {
      const fileID = response.data[0].id;
      await axios({
        method: 'post',
        url: API_URL + url,
        data: { ...body, [attributeName]: fileID },
        headers: {
          ...headers,
          Authorization: `Bearer ${token}`
        }
      })
        .then((resp) => {
          res = resp.data;
        })
        .catch((err) => {
          console.error(err);
        });
    })
    .catch(async (error) => {
      console.error(error);
    });
  return res;
}

export async function getGlobalData(slug) {
  const data = await fetchAPI('/global');
  return data;
}

export async function getContactPageData() {
  const data = await fetchAPI('/contact-page');
  return data;
}

export async function getCoinInstructions() {
  const data = await fetchAPI('/coin-instructions');
  return data;
}

export async function getPrivacyPageData() {
  const data = await fetchAPI('/privacy-policy');
  return data;
}

export async function getTCPageData() {
  const data = await fetchAPI('/terms-and-conditions');
  return data;
}

export async function getFAQPageData() {
  const data = await fetchAPI('/faq-page');
  return data;
}

export async function getOverviewPageData() {
  const data = await fetchAPI('/overview-page');
  return data;
}

export async function getAllPostSlugs() {
  const data = await fetchAPI('/posts');
  return data.map((item) => item.slug);
}

export async function getCoinsCount() {
  const data = await fetchAPI('/coins/count');
  return data;
}

export async function getAllCoins() {
  const data = await fetchAPI('/coins?_sort=name:ASC');
  return data;
}

export async function getTodaysBestCoins() {
  const data = await fetchAPI('/coins/today?active=true');
  return data;
}

export async function getAllTimeBestCoins() {
  const data = await fetchAPI('/coins?_sort=votes:DESC&active=true');
  return data;
}

export async function getAllPromotedCoins() {
  const data = await fetchAPI('/coins?_sort=votes:DESC&promoted=true&active=true');
  return data;
}

// export async function getAllCoins(page=0, pageSize=20) {
//   const data = await fetchAPI(`/coins?_start=${page}&_limit=${pageSize}&active=true&_sort=name:ASC`);
//   return data;
// }

// export async function getTodaysBestCoins(page=0, pageSize=20) {
//   const data = await fetchAPI(`/coins/today?_start=${page}&_limit=${pageSize}`);
//   return data;
// }

// export async function getAllTimeBestCoins(page=0, pageSize=20) {
//   const data = await fetchAPI(`/coins?active=true&_start=${page}&_limit=${pageSize}&_sort=votes:DESC`);
//   return data;
// }

// export async function getAllPromotedCoins() {
//   const data = await fetchAPI('/coins?promoted=true&_start=0&_limit=15&active=true');
//   return data;
// }

export async function getAllCoinVotes() {
  const data = await fetchAPI('/votes');
  return data;
}

export async function getAdvert() {
  const data = await fetchAPI('/advertisements/active');
  return data;
}

export async function getCoinBySlug(slug) {
  const data = await fetchAPI(`/coins?slug=${slug}`);
  return data?.[0];
}

export async function getAllCoinSlugs() {
  const data = await fetchAPI('/coins');
  return data.map((item) => item.slug);
}

export async function submitCoin(coin, logo, token) {
  const data = await postAPIWithFileUpload('/coins', coin, 'logo', logo, token);
  return data;
}

export async function voteForCoin(coin_id, token) {
  const data = await postAPI('/votes', { coin_id }, token);
  return data;
}

export async function getMyCoins(token) {
  const data = await fetchAPIAuth('/coins/my-coins', token);
  return data?.[0];
}

export async function getOrderPageData() {
  const data = await fetchAPI('/order-page-content');
  return data;
}

export async function getMyOrders(token) {
  const data = await fetchAPIAuth('/orders/my-orders', token);
  return data;
}

export async function getMyAdvertOrders(token) {
  const data = await fetchAPIAuth('/orders/my-orders?type=Advert', token);
  return data;
}

export async function getOneOrder(id, token) {
  const data = await fetchAPIAuth(`/orders/${id}`, token);
  return data;
}

export async function getNewsData(page = 1) {
  const data = await fetchAPIUrl(
    `https://newsdata.io/api/1/news?apiKey=pub_16883de5d6c3ffd936facb154260e54a0133&from_date=2021-10-20&q=crypto%20OR%20coin&language=en&page=${page}`
  );
  return data;
}

export async function submitAdvertisement(advert, bannerMedia, token) {
  const data = await postAPIWithFileUpload(
    '/advertisements',
    advert,
    'bannerMedia',
    bannerMedia,
    token
  );
  return data;
}

export async function createOrder(order, token) {
  const data = await postAPI('/orders', order, token);
  return data;
}

export async function fetchUser(token) {
  const data = await fetchAPIAuth('/users/me', token);
  return data;
}

export async function sendAnalyticsEvents(payload) {
  const data = await postAPIGuest('/analytics-events/bulk', payload);
  return data;
}

export async function getAnalyticsReport(id, token) {
  const data = await fetchAPIAuthLocal(`/api/analytics/report?advert=${id}`, token);
  return data;
}

export async function register(payload) {
  const data = await postAPIGuest('/auth/local/register', payload);
  return data;
}

export async function updateUser(id, user, token) {
  const data = await putAPI('/users/' + id, user, token);
  return data;
}
