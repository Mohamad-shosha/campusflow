package sa.edu.fbsu.campus.identity.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.regex.Pattern;

/**
 * Value Object representing a validated Saudi Arabia vehicle license plate.
 * Standard format consists of 3 Arabic letters and 1 to 4 numeric digits.
 * Official Saudi Moroor letter mapping:
 * ا=A, ب=B, ح=J, د=D, ر=R, س=S, ص=X, ط=T, ع=E, ق=G, ك=K, ل=L, م=Z, ن=N, ه=H,
 * و=U, ى=V.
 */
@Embeddable
public class SaudiPlate implements Serializable {

    private static final Pattern DIGITS_PATTERN = Pattern.compile("^\\d{1,4}$");

    private static final Map<Character, Character> AR_TO_EN_MAP;
    private static final Map<Character, Character> EN_TO_AR_MAP;

    static {
        Map<Character, Character> map = new HashMap<>();
        map.put('ا', 'A');
        map.put('ب', 'B');
        map.put('ح', 'J');
        map.put('د', 'D');
        map.put('ر', 'R');
        map.put('س', 'S');
        map.put('ص', 'X');
        map.put('ط', 'T');
        map.put('ع', 'E');
        map.put('ق', 'G');
        map.put('ك', 'K');
        map.put('ل', 'L');
        map.put('م', 'Z');
        map.put('ن', 'N');
        map.put('ه', 'H');
        map.put('و', 'U');
        map.put('ى', 'V');
        AR_TO_EN_MAP = Collections.unmodifiableMap(map);

        Map<Character, Character> reverse = new HashMap<>();
        for (Map.Entry<Character, Character> entry : map.entrySet()) {
            reverse.put(entry.getValue(), entry.getKey());
        }
        // Common ALPR & user phonetic aliases:
        reverse.put('Q', 'ق'); // Q is common alias for G (ق)
        reverse.put('Y', 'ى'); // Y is common alias for V (ى)
        EN_TO_AR_MAP = Collections.unmodifiableMap(reverse);
    }

    @Column(name = "plate_letters_ar", nullable = false, length = 10)
    private String lettersAr;

    @Column(name = "plate_letters_en", nullable = false, length = 10)
    private String lettersEn;

    @Column(name = "plate_digits", nullable = false, length = 10)
    private String digits;

    public SaudiPlate() {
    }

    public SaudiPlate(String rawLettersAr, String rawDigits) {
        if (rawLettersAr == null || rawDigits == null) {
            throw new IllegalArgumentException("License plate letters and digits must not be null");
        }

        String cleanedDigits = rawDigits.trim();
        if (!DIGITS_PATTERN.matcher(cleanedDigits).matches()) {
            throw new IllegalArgumentException(
                    "Saudi license plate digits must be between 1 and 4 digits, got: " + rawDigits);
        }

        String normalizedAr = normalizeArabicLetters(rawLettersAr);
        if (normalizedAr.length() != 3) {
            throw new IllegalArgumentException(
                    "Saudi license plate must contain exactly 3 valid letters, got: " + rawLettersAr);
        }

        StringBuilder enBuilder = new StringBuilder();
        for (char c : normalizedAr.toCharArray()) {
            Character enChar = AR_TO_EN_MAP.get(c);
            if (enChar == null) {
                throw new IllegalArgumentException("Unsupported Arabic plate letter: '" + c + "'");
            }
            enBuilder.append(enChar);
        }

        // Store formatted letters separated by space: "ط ر ق" and "T R G"
        this.lettersAr = String.format("%c %c %c", normalizedAr.charAt(0), normalizedAr.charAt(1),
                normalizedAr.charAt(2));
        this.lettersEn = String.format("%c %c %c", enBuilder.charAt(0), enBuilder.charAt(1), enBuilder.charAt(2));
        this.digits = cleanedDigits;
    }

    public static SaudiPlate fromArabic(String lettersAr, String digits) {
        return new SaudiPlate(lettersAr, digits);
    }

    public static SaudiPlate of(String lettersAr, String digits) {
        return new SaudiPlate(lettersAr, digits);
    }

    public static SaudiPlate fromEnglish(String lettersEn, String digits) {
        if (lettersEn == null) {
            throw new IllegalArgumentException("English letters must not be null");
        }
        String cleaned = lettersEn.replaceAll("\\s+", "").toUpperCase();
        if (cleaned.length() != 3) {
            throw new IllegalArgumentException("English plate code must have exactly 3 characters, got: " + lettersEn);
        }
        StringBuilder arBuilder = new StringBuilder();
        for (char c : cleaned.toCharArray()) {
            Character arChar = EN_TO_AR_MAP.get(c);
            if (arChar == null) {
                throw new IllegalArgumentException("Unsupported English plate letter: '" + c + "'");
            }
            arBuilder.append(arChar);
        }
        return new SaudiPlate(arBuilder.toString(), digits);
    }

    private static String normalizeArabicLetters(String input) {
        String s = input.replaceAll("[\\s\\u0640\\u064B-\\u065F]", ""); // remove spaces, tatweel, tashkeel
        s = s.replace('أ', 'ا').replace('إ', 'ا').replace('آ', 'ا').replace('ة', 'ه').replace('ي', 'ى');
        return s;
    }

    public String getLettersAr() {
        return lettersAr;
    }

    public String getLettersEn() {
        return lettersEn;
    }

    public String getDigits() {
        return digits;
    }

    public String toFormattedAr() {
        return lettersAr + " " + digits;
    }

    public String formattedAr() {
        return toFormattedAr();
    }

    public String toFormattedEn() {
        return lettersEn + " " + digits;
    }

    public String formattedEn() {
        return toFormattedEn();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        SaudiPlate that = (SaudiPlate) o;
        return Objects.equals(lettersAr, that.lettersAr) && Objects.equals(digits, that.digits);
    }

    @Override
    public int hashCode() {
        return Objects.hash(lettersAr, digits);
    }

    @Override
    public String toString() {
        return toFormattedAr() + " (" + toFormattedEn() + ")";
    }
}
