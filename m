# Primitive bash build system

echo Building JSX
babel --plugins transform-react-jsx kalman.jsx > kalman.js

echo Post-processing kalman.html
grep -vwE "browser.min.js|kalman.jsx" kalman.html > temp
sed -e 's#<!--<script src="kalman.js"></script>-->#<script src="kalman.js"></script>#g' temp > kalman_prod.html
rm temp

echo Done building targets: kalman_prod.html, kalman.js
