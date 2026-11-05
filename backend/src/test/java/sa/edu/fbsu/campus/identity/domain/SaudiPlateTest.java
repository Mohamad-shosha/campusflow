package sa.edu.fbsu.campus.identity.domain;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class SaudiPlateTest {

    @Test
    @DisplayName("Should parse and normalize valid Arabic letters and digits (Moroor standard: ق -> G)")
    void shouldParseValidArabicPlate() {
        SaudiPlate plate = SaudiPlate.fromArabic("ط ر ق", "4040");

        assertThat(plate.getLettersAr()).isEqualTo("ط ر ق");
        assertThat(plate.getLettersEn()).isEqualTo("T R G");
        assertThat(plate.getDigits()).isEqualTo("4040");
        assertThat(plate.toFormattedAr()).isEqualTo("ط ر ق 4040");
        assertThat(plate.toFormattedEn()).isEqualTo("T R G 4040");
    }

    @Test
    @DisplayName("Should translate valid English plate letters (including Q alias) to standard Arabic")
    void shouldTranslateEnglishPlateToArabic() {
        // Both official Moroor G and popular Q alias map to Arabic ق
        SaudiPlate plateFromQ = SaudiPlate.fromEnglish("TRQ", "4040");
        SaudiPlate plateFromG = SaudiPlate.fromEnglish("TRG", "4040");

        assertThat(plateFromQ.getLettersAr()).isEqualTo("ط ر ق");
        assertThat(plateFromQ.getLettersEn()).isEqualTo("T R G");
        assertThat(plateFromQ.getDigits()).isEqualTo("4040");

        assertThat(plateFromG.getLettersAr()).isEqualTo("ط ر ق");
        assertThat(plateFromG.getLettersEn()).isEqualTo("T R G");
    }

    @Test
    @DisplayName("Should normalize Arabic tatweel, tashkeel, and alef variations")
    void shouldNormalizeArabicVariants() {
        // "أ ب د" with tatweel and harakat -> "ا ب د" -> "A B D"
        SaudiPlate plate = SaudiPlate.fromArabic("أَـ بْـ دُ", "777");

        assertThat(plate.getLettersAr()).isEqualTo("ا ب د");
        assertThat(plate.getLettersEn()).isEqualTo("A B D");
        assertThat(plate.getDigits()).isEqualTo("777");
    }

    @ParameterizedTest
    @ValueSource(strings = {"1", "42", "312", "9999"})
    @DisplayName("Should accept valid digit counts (1 to 4 digits)")
    void shouldAcceptValidDigitCounts(String digits) {
        SaudiPlate plate = SaudiPlate.fromArabic("س ل م", digits);
        assertThat(plate.getDigits()).isEqualTo(digits);
    }

    @ParameterizedTest
    @ValueSource(strings = {"", "   ", "12345", "abcd", "-5", "12a"})
    @DisplayName("Should reject invalid digit patterns")
    void shouldRejectInvalidDigits(String invalidDigits) {
        assertThatThrownBy(() -> SaudiPlate.fromArabic("ط ر ق", invalidDigits))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @ParameterizedTest
    @ValueSource(strings = {"", "ط", "ط ر", "ط ر ق م", "WXYZ", "123"})
    @DisplayName("Should reject invalid letter counts or unsupported letters")
    void shouldRejectInvalidLetters(String invalidLetters) {
        assertThatThrownBy(() -> SaudiPlate.fromArabic(invalidLetters, "1234"))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    @DisplayName("Should verify value object equality based on letters and digits")
    void shouldVerifyEquality() {
        SaudiPlate plate1 = SaudiPlate.fromArabic("ط ر ق", "4040");
        SaudiPlate plate2 = SaudiPlate.fromEnglish("TRQ", "4040");
        SaudiPlate plate3 = SaudiPlate.fromArabic("س ل م", "4040");

        assertThat(plate1).isEqualTo(plate2);
        assertThat(plate1.hashCode()).isEqualTo(plate2.hashCode());
        assertThat(plate1).isNotEqualTo(plate3);
    }
}
